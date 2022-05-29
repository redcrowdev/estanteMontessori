const Activity = require('../models/activity.js');
const Review = require('../models/review.js');
const Child = require('../models/child.js');
const Session = require('../models/session.js');
const AppError = require('./errorHandling');
const { joiActivitySchema } = require('./validationSchemas.js');

module.exports.isLoggedIn = (req, res, next) => {
   if (!req.isAuthenticated()) {
      req.session.returnTo = req.originalUrl;
      req.flash('error', 'Você precisa fazer o login antes de acessar este recurso.');
      return res.redirect('/');
   }
   next();
}

module.exports.validateActivity = (req, res, next) => {
   const { error } = joiActivitySchema.validate(req.body);
   if (error) {
      const errmsg = error.details.map(element => element.message).join(',')
      throw new AppError(errmsg, 400)
   } else {
      next();
   }
}

module.exports.validateChild = (req, res, next) => {
   const { error } = joiChildSchema.validate(req.body);
   if (error) {
      const errmsg = error.details.map(element => element.message).join(',')
      throw new AppError(errmsg, 400)
   } else {
      next();
   }
}

// module.exports.isActivityOwner = async (req, res, next) => {
//    const { id } = req.params;
//    const activity = await Activity.findById(id);
//    if (!activity.user.equals(req.user._id)) {
//       req.flash('error', 'Você não tem permissão para executar esta ação!!!')
//       return res.redirect(`/atividades/${id}`);
//    }
//    next();
// }

// module.exports.isReviewOwner = async (req, res, next) => {
//    const { id, reviewId } = req.params;
//    const review = await Review.findById(reviewId);
//    if (!review.user.equals(req.user._id)) {
//       req.flash('error', 'Você não tem permissão para executar esta ação!!!')
//       return res.redirect(`/atividades/${id}`);
//    }
//    next();
// }

// module.exports.isChildOwner = async (req, res, next) => {
//    const { id } = req.params;
//    const child = await Child.findById(id);
//    if (req.user.isAdmin == false && !child.user.equals(req.user._id)) {
//       req.flash('error', 'Você não tem permissão para executar esta ação!!!')
//       return res.redirect(`/criancas`);
//    }
//    next();
// }

// module.exports.isSessionOwner = async (req, res, next) => {
//    const { id, sessionId } = req.params;
//    const session = await Session.findById(sessionId);
//    if (!session.user.equals(req.user._id)) {
//       req.flash('error', 'Você não tem permissão para executar esta ação!!!')
//       return res.redirect(`/atividades/${id}`);
//    }
//    next();
// }
