const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
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

router.get('/', wrapAsync(async (req, res, next) => {
   const children = await Child.find({});
   if (!children) {
      throw new AppError('Erro Interno de Servidor', 502);
   }
   res.render('criancas/index', { children })
}))

router.get('/nova-crianca', (req, res) => {
   res.render('criancas/nova-crianca')
})

router.post('/', wrapAsync(async (req, res, next) => {
   const child = new Child(req.body.child);
   await child.save();
   res.redirect(`/criancas/${child._id}`)
}))

router.get('/:id', wrapAsync(async (req, res, next) => {
   const child = await Child.findById(req.params.id).populate('sessions')
   if (!child) {
      throw new AppError('Recurso Não Encontrado', 404);
   }
   res.render('criancas/detalhes', { child });
}))

router.get('/:id/editar', wrapAsync(async (req, res, next) => {
   const child = await Child.findById(req.params.id)
   if (!child) {
      throw new AppError('Recurso Não Encontrado', 404);
   }
   res.render('criancas/editar', { child });
}))

router.put('/:id', wrapAsync(async (req, res, next) => {
   const { id } = req.params;
   const child = await Child.findByIdAndUpdate(id, { ...req.body.child });
   res.redirect(`/criancas/${child._id}`)
}))

router.delete('/:id', wrapAsync(async (req, res, next) => {
   const { id } = req.params;
   await Child.findByIdAndDelete(id);
   res.redirect('/criancas');
}))

module.exports = router;