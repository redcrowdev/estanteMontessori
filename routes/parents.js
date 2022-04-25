const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require('../utils/wrapAsync');
const parentsController = require('../controllers/parents.js')
// const AppError = require('../utils/errorHandling');
// const Child = require('../models/child.js');
// const Session = require('../models/session.js');
const { isLoggedIn } = require('../utils/middleware.js');

router.get('/novo-responsavel', isLoggedIn, parentsController.newForm)

router.post('/', isLoggedIn, wrapAsync(parentsController.create))

router.get('/:parentId', isLoggedIn, parentsController.canEdit, wrapAsync(parentsController.editForm))

router.put('/:parentId', isLoggedIn, parentsController.canEdit, wrapAsync(parentsController.editData))

router.delete('/:parentId', isLoggedIn, parentsController.canDelete, wrapAsync(parentsController.delete))

module.exports = router;