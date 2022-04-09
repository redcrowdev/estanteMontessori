const Activity = require('../models/activity.js');

module.exports.showList = async (req, res, next) => {
   const activities = await Activity.find({}).populate('user');
   if (!activities) {
      req.flash('error', 'Atividades não encontradas!')
      res.redirect('/home')
   }
   res.render('atividades/index', { activities })
}

module.exports.newForm = (req, res) => {
   res.render('atividades/nova-atividade')
}

module.exports.create = async (req, res, next) => {
   const activity = new Activity(req.body.activity);
   if (!activity) {
      req.flash('error', 'Erro ao criar a Atividade!')
      return res.redirect('/atividades')
   }
   activity.user = req.user._id;
   await activity.save();
   req.flash('success', 'Atividade criada com sucesso!')
   res.redirect(`/atividades/${activity._id}`)
}

module.exports.details = async (req, res, next) => {
   const activity = await Activity.findById(req.params.id).populate({
      path: 'reviews',
      populate: {
         path: 'user'
      }
   }).populate('user');
   if (!activity) {
      req.flash('error', 'Atividade não encontrada!')
      return res.redirect('/atividades')
   }
   res.render('atividades/detalhes', { activity });
}

module.exports.editForm = async (req, res, next) => {
   const { id } = req.params;
   const activity = await Activity.findById(id)
   if (!activity) {
      req.flash('error', 'Atividade não encontrada!')
      return res.redirect('/atividades')
   }
   res.render('atividades/editar', { activity });
}

module.exports.editData = async (req, res, next) => {
   const { id } = req.params;
   const activity = await Activity.findByIdAndUpdate(id, { ...req.body.activity });
   if (!activity) {
      req.flash('error', 'Erro ao editar a Atividade!')
      return res.redirect('/atividades')
   }
   req.flash('success', 'Atividade editada com sucesso!')
   res.redirect(`/atividades/${activity._id}`)
}

module.exports.delete = async (req, res, next) => {
   const { id } = req.params;
   const activity = await Activity.findByIdAndDelete(id);
   if (!activity) {
      req.flash('error', 'Erro ao excluir a Atividade!')
      return res.redirect('/atividades')
   }
   req.flash('success', 'Atividade excluída com sucesso!')
   res.redirect('/atividades');
}