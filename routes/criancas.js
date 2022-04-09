const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const childController = require('../controllers/children.js')
const { isLoggedIn, isChildOwner } = require('../utils/middleware')

router.get('/', isLoggedIn, wrapAsync(childController.showList))

router.get('/nova-crianca', isLoggedIn, childController.newForm)

router.post('/', isLoggedIn, wrapAsync(childController.create))

router.get('/:id', isLoggedIn, isChildOwner, wrapAsync(childController.details))

router.get('/:id/editar', isLoggedIn, isChildOwner, wrapAsync(childController.editForm))

router.put('/:id', isLoggedIn, isChildOwner, wrapAsync(childController.editData))

router.delete('/:id', isLoggedIn, wrapAsync(childController.delete))

module.exports = router;