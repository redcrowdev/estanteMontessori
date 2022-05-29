const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const childController = require('../controllers/children.js')
const { isLoggedIn } = require('../utils/middleware')
const multer = require('multer');
const { storage } = require('../cloudinary/index.js')
const upload = multer({ storage });

router.get('/', isLoggedIn, wrapAsync(childController.showList))

router.get('/nova-crianca', isLoggedIn, childController.newForm)

router.post('/', isLoggedIn, upload.single('image'), wrapAsync(childController.create))

router.get('/:id', isLoggedIn, childController.isChildOwner, wrapAsync(childController.details))

router.get('/:id/editar', isLoggedIn, childController.canEdit, wrapAsync(childController.editForm))

router.put('/:id', isLoggedIn, childController.canEdit, upload.single('image'), wrapAsync(childController.editData))

router.delete('/:id', isLoggedIn, childController.canDelete, wrapAsync(childController.delete))

module.exports = router;