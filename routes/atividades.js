const express = require('express');
const router = express.Router();
const Activity = require('../models/activity.js');
//const { joiActivitySchema } = require('../utils/validationSchemas.js');
const { isLoggedIn, isActivityOwner, validateActivity } = require('../utils/middleware')
const wrapAsync = require('../utils/wrapAsync');


router.get('/', wrapAsync(async (req, res, next) => {
   const activities = await Activity.find({}).populate('user');
   if (!activities) {
      //throw new AppError('Erro Interno de Servidor', 502);
      req.flash('error', 'Atividades não encontradas!')
      res.redirect('/home')
   }
   res.render('atividades/index', { activities })
}))

router.get('/nova-atividade', isLoggedIn, (req, res) => {
   res.render('atividades/nova-atividade')
})

router.post('/', isLoggedIn, validateActivity, wrapAsync(async (req, res, next) => {
   const activity = new Activity(req.body.activity);
   if (!activity) {
      req.flash('error', 'Erro ao criar a Atividade!')
      return res.redirect('/atividades')
   }
   activity.user = req.user._id;
   await activity.save();
   req.flash('success', 'Atividade criada com sucesso!')
   res.redirect(`/atividades/${activity._id}`)
}))

router.get('/:id', wrapAsync(async (req, res, next) => {
   const activity = await Activity.findById(req.params.id).populate({
      path: 'reviews',
      populate: {
         path: 'user'
      }
   }).populate('user');
   if (!activity) {
      //throw new AppError('Recurso Não Encontrado', 404);
      req.flash('error', 'Atividade não encontrada!')
      return res.redirect('/atividades')
   }
   res.render('atividades/detalhes', { activity });
}))

router.get('/:id/editar', isLoggedIn, isActivityOwner, wrapAsync(async (req, res, next) => {
   const { id } = req.params;
   const activity = await Activity.findById(id)
   if (!activity) {
      req.flash('error', 'Atividade não encontrada!')
      return res.redirect('/atividades')
   }
   res.render('atividades/editar', { activity });
}))

router.put('/:id', isLoggedIn, isActivityOwner, validateActivity, wrapAsync(async (req, res, next) => {
   const { id } = req.params;
   const activity = await Activity.findByIdAndUpdate(id, { ...req.body.activity });
   if (!activity) {
      //throw new AppError('Recurso Não Encontrado', 404);
      req.flash('error', 'Erro ao editar a Atividade!')
      return res.redirect('/atividades')
   }
   req.flash('success', 'Atividade editada com sucesso!')
   res.redirect(`/atividades/${activity._id}`)
}))

router.delete('/:id', isLoggedIn, isActivityOwner, wrapAsync(async (req, res, next) => {
   const { id } = req.params;
   const activity = await Activity.findByIdAndDelete(id);
   if (!activity) {
      //throw new AppError('Recurso Não Encontrado', 404);
      req.flash('error', 'Erro ao excluir a Atividade!')
      return res.redirect('/atividades')
   }
   req.flash('success', 'Atividade excluída com sucesso!')
   res.redirect('/atividades');
}))

module.exports = router;