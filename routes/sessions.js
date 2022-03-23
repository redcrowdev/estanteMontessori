const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require('../utils/wrapAsync');
const AppError = require('../utils/errorHandling');
const Child = require('../models/child.js');
const Session = require('../models/session.js');

router.post('/', wrapAsync(async (req, res) => {
   const child = await Child.findById(req.params.id);
   const session = new Session(req.body.session);
   child.sessions.push(session);
   await session.save();
   await child.save();
   res.redirect(`/criancas/${child._id}`)
}))

router.get('/:sessionId', wrapAsync(async (req, res) => {
   const child = await Child.findById(req.params.id);
   const session = await Session.findById(req.params.sessionId);
   if (!child) {
      throw new AppError('Recurso Não Encontrado', 404);
   }
   res.render('criancas/editar-sessao', { child, session });
}))

router.put('/:sessionId', wrapAsync(async (req, res) => {
   const { id, sessionId } = req.params;
   await Session.findByIdAndUpdate(sessionId, { ...req.body.session });
   res.redirect(`/criancas/${id}`);
}))

router.delete('/:sessionId', wrapAsync(async (req, res) => {
   const { id, sessionId } = req.params;
   await Child.findByIdAndUpdate(id, { $pull: { sessions: sessionId } });
   await Session.findByIdAndDelete(sessionId);
   res.redirect(`/criancas/${id}`)
}))

module.exports = router;