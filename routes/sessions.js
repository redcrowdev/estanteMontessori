const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require('../utils/wrapAsync');
const sessionsController = require('../controllers/sessions.js')

const { isLoggedIn } = require('../utils/middleware.js');

router.post('/', isLoggedIn, wrapAsync(sessionsController.create))

router.get('/:sessionId', isLoggedIn, sessionsController.canEdit, wrapAsync(sessionsController.editForm))

router.put('/:sessionId', isLoggedIn, sessionsController.canEdit, wrapAsync(sessionsController.editData))

router.delete('/:sessionId', isLoggedIn, sessionsController.canDelete, wrapAsync(sessionsController.delete))

module.exports = router;