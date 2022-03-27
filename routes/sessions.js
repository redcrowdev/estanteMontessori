const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require('../utils/wrapAsync');
const AppError = require('../utils/errorHandling');
const Child = require('../models/child.js');
const Session = require('../models/session.js');
const { isLoggedIn, isSessionOwner } = require('../utils/middleware.js');

router.post('/', isLoggedIn, wrapAsync(async (req, res) => {
   const child = await Child.findById(req.params.id);
   const session = new Session(req.body.session);
   session.user = req.user._id;
   child.sessions.push(session);
   await session.save();
   await child.save();
   req.flash('success', 'Sessão de Estudo criada com sucesso!')
   res.redirect(`/criancas/${child._id}`)
}))

router.get('/:sessionId', isLoggedIn, wrapAsync(async (req, res) => {
   const child = await Child.findById(req.params.id);
   const session = await Session.findById(req.params.sessionId);
   if (!child) {
      throw new AppError('Recurso Não Encontrado', 404);
   }
   res.render('criancas/editar-sessao', { child, session });
}))

router.put('/:sessionId', isLoggedIn, isSessionOwner, wrapAsync(async (req, res) => {
   const { id, sessionId } = req.params;
   await Session.findByIdAndUpdate(sessionId, { ...req.body.session });
   req.flash('success', 'Sessão de Estudo editada com sucesso!')
   res.redirect(`/criancas/${id}`);
}))

router.delete('/:sessionId', isLoggedIn, isSessionOwner, wrapAsync(async (req, res) => {
   const { id, sessionId } = req.params;
   await Child.findByIdAndUpdate(id, { $pull: { sessions: sessionId } });
   await Session.findByIdAndDelete(sessionId);
   res.redirect(`/criancas/${id}`)
}))

module.exports = router;