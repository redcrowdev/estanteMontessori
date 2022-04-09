const Activity = require('../models/activity.js');
const Review = require('../models/review.js');

module.exports.create = async (req, res) => {
   const activity = await Activity.findById(req.params.id);
   if (!activity) {
      req.flash('error', 'Atividade não encontrada!')
      return res.redirect(`/atividades`)
   }
   const review = new Review(req.body.review);
   if (!review) {
      req.flash('error', 'Não foi possível incluir o comentário!')
      return res.redirect(`/atividades/${id}`)
   }
   review.user = req.user._id;
   activity.reviews.push(review);
   await review.save();
   await activity.save();
   req.flash('success', 'Comentário criado com sucesso!')
   res.redirect(`/atividades/${activity._id}`)
}

module.exports.canEdit = async (req, res, next) => {
   const { id, reviewId } = req.params;
   const review = await Review.findById(reviewId);
   if (!review.user.equals(req.user._id)) {
      req.flash('error', 'Você não tem permissão para executar esta ação!!!')
      return res.redirect(`/atividades/${id}`);
   }
   next();
}

module.exports.editForm = async (req, res) => {
   const { id, reviewId } = req.params
   const activity = await Activity.findById(id);
   if (!activity) {
      req.flash('error', 'Atividade não encontrada!')
      return res.redirect(`/atividades`)
   }
   const review = await Review.findById(reviewId);
   if (!review) {
      req.flash('error', 'Comentário não encontrado!')
      return res.redirect(`/atividades/${id}`)
   }
   res.render('atividades/editar-review', { activity, review });
}

module.exports.editData = async (req, res) => {
   const { id, reviewId } = req.params;
   const review = await Review.findByIdAndUpdate(reviewId, { ...req.body.review });
   if (!review) {
      req.flash('error', 'Comentário não encontrado!')
      return res.redirect(`/atividades/${id}`)
   }
   req.flash('success', 'Comentário editado com sucesso!')
   res.redirect(`/atividades/${id}`);
}

module.exports.canDelete = async (req, res, next) => {
   const { id, reviewId } = req.params;
   const review = await Review.findById(reviewId);
   if (req.user.isAdmin == false && !review.user.equals(req.user._id)) {
      req.flash('error', 'Você não tem permissão para executar esta ação!!!')
      return res.redirect(`/atividades/${id}`);
   }
   next();
}

module.exports.delete = async (req, res) => {
   const { id, reviewId } = req.params;
   await Activity.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
   const review = await Review.findByIdAndDelete(reviewId);
   if (!review) {
      req.flash('error', 'Comentário não encontrado!')
      return res.redirect(`/atividades/${id}`)
   }
   req.flash('success', 'Comentário excluído com sucesso!')
   res.redirect(`/atividades/${id}`)
}