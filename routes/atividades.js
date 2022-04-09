const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activities.js')
const { isLoggedIn, validateActivity } = require('../utils/middleware')
const wrapAsync = require('../utils/wrapAsync');

router.get('/', isLoggedIn, wrapAsync(activityController.showList))

router.get('/nova-atividade', isLoggedIn, activityController.newForm)

router.post('/', isLoggedIn, validateActivity, wrapAsync(activityController.create))

router.get('/:id', wrapAsync(activityController.details))

router.get('/:id/editar', isLoggedIn, activityController.canEdit, wrapAsync(activityController.editForm))

router.put('/:id', isLoggedIn, activityController.canEdit, validateActivity, wrapAsync(activityController.editData))

router.delete('/:id', isLoggedIn, activityController.canDelete, wrapAsync(activityController.delete))

module.exports = router;