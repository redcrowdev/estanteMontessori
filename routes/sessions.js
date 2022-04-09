const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require('../utils/wrapAsync');
const sessionsController = require('../controllers/sessions.js')
const AppError = require('../utils/errorHandling');
const Child = require('../models/child.js');
const Session = require('../models/session.js');
const { isLoggedIn, isSessionOwner } = require('../utils/middleware.js');

router.post('/', isLoggedIn, wrapAsync(sessionsController.create))

router.get('/:sessionId', isLoggedIn, wrapAsync(sessionsController.editForm))

router.put('/:sessionId', isLoggedIn, isSessionOwner, wrapAsync(sessionsController.editData))

router.delete('/:sessionId', isLoggedIn, isSessionOwner, wrapAsync(sessionsController.delete))

module.exports = router;