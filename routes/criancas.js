const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const { isLoggedIn, isChildOwner } = require('../utils/middleware')
const AppError = require('../utils/errorHandling');
const Child = require('../models/child.js');

const validateChild = (req, res, next) => {
   const { error } = joiChildSchema.validate(req.body);
   if (error) {
      const errmsg = error.details.map(element => element.message).join(',')
      throw new AppError(errmsg, 400)
   } else {
      next();
   }
}

router.get('/', isLoggedIn, wrapAsync(async (req, res, next) => {
   const children = await Child.find({}).populate('user').populate({
      path: 'sessions',
      populate: {
         path: 'user'
      }
   });
   if (!children) {
      //throw new AppError('Erro Interno de Servidor', 502);
      req.flash('error', 'Crianças não encontradas!')
      res.redirect('/home')
   }
   res.render('criancas/index', { children })
}))

router.get('/nova-crianca', isLoggedIn, (req, res) => {
   res.render('criancas/nova-crianca')
})

router.post('/', isLoggedIn, wrapAsync(async (req, res, next) => {
   const child = new Child(req.body.child);
   if (!child) {
      //throw new AppError('Erro Interno de Servidor', 502);
      req.flash('error', 'Erro ao criar a criança!')
      res.redirect('/criancas/index')
   }
   child.user = req.user._id;
   await child.save();
   req.flash('success', 'Criança criada com sucesso!')
   res.redirect(`/criancas/${child._id}`)
}))

router.get('/:id', isLoggedIn, isChildOwner, wrapAsync(async (req, res, next) => {
   const child = await Child.findById(req.params.id).populate('sessions').populate('user');
   if (!child) {
      //throw new AppError('Recurso Não Encontrado', 404);
      req.flash('error', 'Criança não encontrada!!')
      res.redirect('/criancas/index')
   }
   res.render('criancas/detalhes', { child });
}))

router.get('/:id/editar', isLoggedIn, isChildOwner, wrapAsync(async (req, res, next) => {
   const child = await Child.findById(req.params.id)
   if (!child) {
      //throw new AppError('Recurso Não Encontrado', 404);
      req.flash('error', 'Criança não encontrada!!')
      res.redirect('/criancas/index')
   }
   res.render('criancas/editar', { child });
}))

router.put('/:id', isLoggedIn, isChildOwner, wrapAsync(async (req, res, next) => {
   const { id } = req.params;
   const child = await Child.findByIdAndUpdate(id, { ...req.body.child });
   if (!child) {
      //throw new AppError('Recurso Não Encontrado', 404);
      req.flash('error', 'Criança não encontrada!!')
      res.redirect('/criancas/index')
   }
   req.flash('success', 'Criança editada com sucesso!')
   res.redirect(`/criancas/${child._id}`)
}))

router.delete('/:id', isLoggedIn, wrapAsync(async (req, res, next) => {
   const { id } = req.params;
   const child = await Child.findByIdAndDelete(id);
   if (!child) {
      //throw new AppError('Recurso Não Encontrado', 404);
      req.flash('error', 'Criança não encontrada!!')
      res.redirect('/criancas/index')
   }
   req.flash('success', 'Criança excluida com sucesso!')
   res.redirect('/criancas');
}))

module.exports = router;