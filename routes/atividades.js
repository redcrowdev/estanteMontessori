const express = require('express');
const router = express.Router();
const { joiActivitySchema } = require('../validationSchemas.js');
const wrapAsync = require('../utils/wrapAsync');
const AppError = require('../utils/errorHandling');
const Activity = require('../models/activity.js');

//Custom Middlewares
const validateActivity = (req, res, next) => {
   const { error } = joiActivitySchema.validate(req.body);
   if (error) {
      const errmsg = error.details.map(element => element.message).join(',')
      throw new AppError(errmsg, 400)
   } else {
      next();
   }
}

router.get('/', wrapAsync(async (req, res, next) => {
   const activities = await Activity.find({});
   if (!activities) {
      throw new AppError('Erro Interno de Servidor', 502);
   }
   res.render('atividades/index', { activities })
}))

router.get('/nova-atividade', (req, res) => {
   res.render('atividades/nova-atividade')
})

router.post('/', validateActivity, wrapAsync(async (req, res, next) => {
   const activity = new Activity(req.body.activity);
   await activity.save();
   res.redirect(`/atividades/${activity._id}`)
}))

router.get('/:id', wrapAsync(async (req, res, next) => {
   const activity = await Activity.findById(req.params.id).populate('reviews')
   if (!activity) {
      throw new AppError('Recurso Não Encontrado', 404);
   }
   res.render('atividades/detalhes', { activity });
}))

router.get('/:id/editar', wrapAsync(async (req, res, next) => {
   const activity = await Activity.findByIdAndUpdate(req.params.id)
   if (!activity) {
      throw new AppError('Recurso Não Encontrado', 404);
   }
   res.render('atividades/editar', { activity });
}))

router.put('/:id', validateActivity, wrapAsync(async (req, res, next) => {
   const { id } = req.params;
   const activity = await Activity.findByIdAndUpdate(id, { ...req.body.activity });
   res.redirect(`/atividades/${activity._id}`)
}))

router.delete('/:id', wrapAsync(async (req, res, next) => {
   const { id } = req.params;
   await Activity.findByIdAndDelete(id);
   res.redirect('/atividades');
}))

module.exports = router;