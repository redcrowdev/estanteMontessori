const User = require('../models/user.js');
const passport = require('passport');

module.exports.registerForm = (req, res) => {
   res.render('users/register')
}

module.exports.newUser = async (req, res, next) => {
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
}

module.exports.loginForm = (req, res) => {
   res.render('users/login');
}

module.exports.loginAuth = passport.authenticate('local', { failireFlash: true, failureRedirect: '/login' }), (req, res) => {
   req.flash('success', 'Bem vinda(o)!');
   const redirectUrl = req.session.returnTo || '/atividades';
   delete req.session.returnTo;
   res.redirect(redirectUrl)
}

module.exports.logout = (req, res) => {
   req.logout();
   req.flash('success', 'Usuário deslogado com sucesso!');
   res.redirect('/');
}