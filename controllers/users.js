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
   res.render('/');
}

module.exports.loginAuth = passport.authenticate('local', { failireFlash: true, failureRedirect: '/' }), (req, res) => {
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

module.exports.view = async (req, res, next) => {
   const id = req.user._id;
   const user = await User.findById(id);
   res.render('users/profile', { user });
}

module.exports.editForm = async (req, res, next) => {
   const id = req.user._id;
   const user = await User.findById(id)
   if (!user) {
      req.flash('error', 'Usuário não encontrado!')
      return res.redirect('/perfil')
   }
   res.render('users/editar', { user });
}

module.exports.editData = async (req, res, next) => {
   const id = req.user._id;
   const user = await User.findById(id);
   if (!user) {
      req.flash('error', 'Erro ao editar o Usuário!')
      return res.redirect('/perfil')
   }
   if (req.file) {
      user.picture.url = req.file.path;
   }
   if (req.file) {
      user.picture.fileName = req.file.filename;
   }
   await user.updateOne({ ...req.body.user });
   await user.save()
   req.flash('success', 'Usuário Editado com sucesso!')
   res.redirect('/perfil')
}

module.exports.delete = async (req, res, next) => {
   const id = req.user._id;
   const user = await User.findById(id);
   if (!user) {
      req.flash('error', 'Erro ao excluir o Usuário')
      return res.redirect('/perfil')
   }
   await User.findByIdAndDelete(id);
   req.logout();
   req.flash('success', 'Usuário Excluído com sucesso!')
   res.redirect('/');
}