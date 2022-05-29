const express = require('express');
const router = express.Router();
const toolController = require('../controllers/tools.js')
const { isLoggedIn } = require('../utils/middleware')
const wrapAsync = require('../utils/wrapAsync');
const multer = require('multer');
const { storage } = require('../cloudinary/index.js')
const upload = multer({ storage });

router.get('/', isLoggedIn, wrapAsync(toolController.showList))

router.get('/nova-ferramenta', isLoggedIn, toolController.newForm)

router.post('/', isLoggedIn, upload.single('image'), wrapAsync(toolController.create))

router.get('/:id/editar', isLoggedIn, toolController.canEdit, wrapAsync(toolController.editForm))

router.put('/:id', isLoggedIn, toolController.canEdit, upload.single('image'), wrapAsync(toolController.editData))

router.delete('/:id', isLoggedIn, toolController.canDelete, wrapAsync(toolController.delete))

module.exports = router; 