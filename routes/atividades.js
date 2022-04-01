const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activities.js')
const { isLoggedIn, isActivityOwner, validateActivity } = require('../utils/middleware')
const wrapAsync = require('../utils/wrapAsync');

router.get('/', isLoggedIn, wrapAsync(activityController.showList))

router.get('/nova-atividade', isLoggedIn, activityController.newForm)

router.post('/', isLoggedIn, validateActivity, wrapAsync(activityController.create))

router.get('/:id', wrapAsync(activityController.details))

router.get('/:id/editar', isLoggedIn, isActivityOwner, wrapAsync(activityController.editForm))

router.put('/:id', isLoggedIn, isActivityOwner, validateActivity, wrapAsync(activityController.editData))

router.delete('/:id', isLoggedIn, isActivityOwner, wrapAsync(activityController.delete))

module.exports = router;