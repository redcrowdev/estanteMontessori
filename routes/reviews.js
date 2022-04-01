const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require('../utils/wrapAsync');
const reviewsController = require('../controllers/reviews.js')
const { isLoggedIn, isReviewOwner } = require('../utils/middleware.js');

router.post('/', isLoggedIn, wrapAsync(reviewsController.create))

router.get('/:reviewId', isLoggedIn, wrapAsync(reviewsController.editForm))

router.put('/:reviewId', isLoggedIn, isReviewOwner, wrapAsync(reviewsController.editData))

router.delete('/:reviewId', isLoggedIn, isReviewOwner, wrapAsync(reviewsController.delete))

module.exports = router;