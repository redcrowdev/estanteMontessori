const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require('../utils/wrapAsync');
const parentsController = require('../controllers/parents.js')
const { isLoggedIn } = require('../utils/middleware.js');
const multer = require('multer');
const { storage } = require('../cloudinary/index.js')
const upload = multer({ storage });

router.get('/novo-responsavel', isLoggedIn, parentsController.newForm)

router.post('/', isLoggedIn, upload.single('image'), wrapAsync(parentsController.create))

router.get('/:parentId', isLoggedIn, parentsController.canEdit, wrapAsync(parentsController.editForm))

router.put('/:parentId', isLoggedIn, parentsController.canEdit, upload.single('image'), wrapAsync(parentsController.editData))

router.delete('/:parentId', isLoggedIn, parentsController.canDelete, wrapAsync(parentsController.delete))

module.exports = router; 