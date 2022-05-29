const express = require('express');
const { isRef } = require('joi');
const router = express.Router();
const passport = require('passport');
const { NoSaltValueStoredError } = require('passport-local-mongoose/lib/errors');
const User = require('../models/user.js');
const userController = require('../controllers/users');
const { isLoggedIn } = require('../utils/middleware')
const wrapAsync = require('../utils/wrapAsync')
const multer = require('multer');
const { storage } = require('../cloudinary/index.js')
const upload = multer({ storage });

router.get('/registrar', (req, res) => {
   res.render('users/register')
})

router.post('/registrar', wrapAsync(async (req, res, next) => {
   try {
      const { email, username, password } = req.body;
      const user = new User({ email, username });
      const newUser = await User.register(user, password);
      req.login(newUser, err => {
         if (err) {
            const baseUrl = req.baseUrl;
            return next(err)
         };
         req.flash('success', 'Bem Vinda(o) à Estante Montessori');
         res.redirect('/atividades');
      });
   } catch (e) {
      req.flash('error', e.message);
      return res.redirect('/registrar')
   }
}))

router.get('/login', (req, res) => {
   res.render('/');
})

router.post('/login', passport.authenticate('local', { failireFlash: true, failureRedirect: '/' }), (req, res) => {
   req.flash('success', 'Bem vinda(o)!');
   const redirectUrl = req.session.returnTo || '/atividades';
   delete req.session.returnTo;
   res.redirect(redirectUrl)
})

router.get('/logout', (req, res) => {
   req.logout();
   req.flash('success', 'Usuário deslogado com sucesso!');
   res.redirect('/');
})

router.get('/perfil', isLoggedIn, wrapAsync(userController.view))

router.get('/:id/editar', isLoggedIn, wrapAsync(userController.editForm))

router.put('/:id', isLoggedIn, upload.single('image'), wrapAsync(userController.editData))

router.delete('/:id', isLoggedIn, wrapAsync(userController.delete))

module.exports = router;