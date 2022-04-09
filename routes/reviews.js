const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require('../utils/wrapAsync');
const reviewsController = require('../controllers/reviews.js')
const { isLoggedIn } = require('../utils/middleware.js');

router.post('/', isLoggedIn, wrapAsync(reviewsController.create))

router.get('/:reviewId', isLoggedIn, reviewsController.canEdit, wrapAsync(reviewsController.editForm))

router.put('/:reviewId', isLoggedIn, reviewsController.canEdit, wrapAsync(reviewsController.editData))

router.delete('/:reviewId', isLoggedIn, reviewsController.canDelete, wrapAsync(reviewsController.delete))

module.exports = router;