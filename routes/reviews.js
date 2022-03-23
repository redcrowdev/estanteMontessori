const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require('../utils/wrapAsync');
const AppError = require('../utils/errorHandling');
const Activity = require('../models/activity.js');
const Review = require('../models/review.js');

router.post('/', wrapAsync(async (req, res) => {
   const activity = await Activity.findById(req.params.id);
   const review = new Review(req.body.review);
   activity.reviews.push(review);
   await review.save();
   await activity.save();
   res.redirect(`/atividades/${activity._id}`)
}))

router.get('/:reviewId', wrapAsync(async (req, res) => {
   const activity = await Activity.findById(req.params.id);
   const review = await Review.findById(req.params.reviewId);
   if (!activity) {
      throw new AppError('Recurso Não Encontrado', 404);
   }
   res.render('atividades/editar-review', { activity, review });
}))

router.put('/:reviewId', wrapAsync(async (req, res) => {
   const { id, reviewId } = req.params;
   await Review.findByIdAndUpdate(reviewId, { ...req.body.review });
   res.redirect(`/atividades/${id}`);
}))

router.delete('/:reviewId', wrapAsync(async (req, res) => {
   const { id, reviewId } = req.params;
   await Activity.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
   await Review.findByIdAndDelete(reviewId);
   res.redirect(`/atividades/${id}`)
}))

module.exports = router;