const Activity = require('../models/activity.js');
const User = require('../models/user.js');
const SensiblePeriod = require('../models/sensiblePeriod.js');

module.exports.showList = async (req, res, next) => {
   const activities = await Activity.find({}).sort({ title: 'asc' }).populate('user');
   const count = await Activity.countDocuments();
   if (!activities) {
      req.flash('error', 'Atividades não encontradas!')
      res.redirect('/home')
   }
   res.render('atividades/index', { activities, count })
}

module.exports.newForm = async (req, res) => {
   const sensiblePeriod = await SensiblePeriod.find({})
   res.render('atividades/nova-atividade', { sensiblePeriod })
}

module.exports.create = async (req, res, next) => {
   const activity = new Activity(req.body.activity);
   if (!activity) {
      req.flash('error', 'Erro ao criar a Atividade!')
      return res.redirect('/atividades')
   }
   const user = await User.findById(req.user._id); //incluído aqui
   if (req.file) {
      activity.picture.url = req.file.path;
   }
   if (req.file) {
      activity.picture.fileName = req.file.filename;
   }
   activity.user = req.user._id;
   user.activities.push(activity); //incluído aqui
   await activity.save();
   await user.save(); //incluído aqui
   req.flash('success', 'Atividade criada com sucesso!')
   res.redirect(`/atividades/${activity._id}`)

}

module.exports.details = async (req, res, next) => {
   const activity = await Activity.findById(req.params.id).populate({
      path: 'reviews',
      populate: {
         path: 'user'
      }
   }).populate('user')
   if (!activity) {
      req.flash('error', 'Atividade não encontrada!')
      return res.redirect('/atividades')
   }
   res.render('atividades/detalhes', { activity });
}

module.exports.canEdit = async (req, res, next) => {
   const { id } = req.params;
   const activity = await Activity.findById(id);
   if (!activity.user.equals(req.user._id)) {
      req.flash('error', 'Você não tem permissão para executar esta ação!!!')
      return res.redirect(`/atividades/${id}`);
   }
   next();
}

module.exports.editForm = async (req, res, next) => {
   const { id } = req.params;
   const activity = await Activity.findById(id)
   const sensiblePeriod = await SensiblePeriod.find({})
   if (!activity) {
      req.flash('error', 'Atividade não encontrada!')
      return res.redirect('/atividades')
   }
   res.render('atividades/editar', { activity, sensiblePeriod });
}

module.exports.editData = async (req, res, next) => {
   const { id } = req.params;
   const activity = await Activity.findById(id);
   if (!activity) {
      req.flash('error', 'Erro ao editar a Atividade!')
      return res.redirect('/atividades')
   }
   if (req.file) {
      activity.picture.url = req.file.path;
   }
   if (req.file) {
      activity.picture.fileName = req.file.filename;
   }
   await activity.updateOne({ ...req.body.activity });
   await activity.save()
   req.flash('success', 'Atividade editada com sucesso!')
   res.redirect(`/atividades/${activity._id}`)
}

module.exports.canDelete = async (req, res, next) => {
   const { id } = req.params;
   const activity = await Activity.findById(id);
   if (req.user.isAdmin == false && !activity.user.equals(req.user._id)) {
      req.flash('error', 'Você não tem permissão para executar esta ação!!!')
      return res.redirect(`/atividades/${id}`);
   }
   next();
}

module.exports.delete = async (req, res, next) => {
   const { id } = req.params;
   const activity = await Activity.findById(id);
   if (!activity) {
      req.flash('error', 'Erro ao excluir a Atividade!')
      return res.redirect('/atividades')
   }

   const reviews = activity.reviews;
   reviews.forEach(async review => {
      await User.findByIdAndUpdate(req.user._id, { $pull: { reviews: review } })
   });

   await User.findByIdAndUpdate(req.user._id, { $pull: { activities: id } })
   await Activity.findByIdAndDelete(id);
   req.flash('success', 'Atividade excluída com sucesso!')
   res.redirect('/atividades');
}