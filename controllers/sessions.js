const Child = require('../models/child.js');
const Session = require('../models/session.js');
const User = require('../models/user.js');
const FocusArea = require('../models/focusArea.js');
const SessionType = require('../models/sessionType.js');
const AppError = require('../utils/errorHandling');

module.exports.create = async (req, res) => {
   const child = await Child.findById(req.params.id);
   if (!child) {
      req.flash('error', 'Criança não encontrada!');
   }
   const session = new Session(req.body.session);
   if (!session) {
      req.flash('error', 'Não foi possível incluir a Sessão de Estudo!');
   }
   const user = await User.findById(req.user._id); //incluído aqui
   session.user = req.user._id;
   user.sessions.push(session); //incluído aqui
   child.sessions.push(session);
   await session.save();
   await child.save();
   await user.save(); //incluído aqui
   req.flash('success', 'Sessão de Estudo criada com sucesso!')
   res.redirect(`/criancas/${child._id}`)
}

module.exports.canEdit = async (req, res, next) => {
   const { id, sessionId } = req.params;
   const session = await Session.findById(sessionId);
   if (!session.user.equals(req.user._id)) {
      req.flash('error', 'Você não tem permissão para executar esta ação!!!')
      return res.redirect(`/criancas/${id}`);
   }
   next();
}

module.exports.editForm = async (req, res) => {
   const child = await Child.findById(req.params.id);
   const focusArea = await FocusArea.find({});
   const sessionType = await SessionType.find({});
   if (!child) {
      req.flash('error', 'Criança não encontrada!');
   }
   const session = await Session.findById(req.params.sessionId);
   if (!session) {
      req.flash('error', 'Sessão de Estudo não Encontrada!');
   }
   res.render('criancas/editar-sessao', { child, session, focusArea, sessionType });
}

module.exports.editData = async (req, res) => {
   const { id, sessionId } = req.params;
   const session = await Session.findByIdAndUpdate(sessionId, { ...req.body.session });
   if (!session) {
      req.flash('error', 'Sessão de Estudo não Encontrada!');
   }
   req.flash('success', 'Sessão de Estudo editada com sucesso!')
   res.redirect(`/criancas/${id}`);
}

module.exports.canDelete = async (req, res, next) => {
   const { id, sessionId } = req.params;
   const session = await Session.findById(sessionId);
   if (req.user.isAdmin == false && !session.user.equals(req.user._id)) {
      req.flash('error', 'Você não tem permissão para executar esta ação!!!')
      return res.redirect(`/criancas/${id}`);
   }
   next();
}

module.exports.delete = async (req, res) => {
   const { id, sessionId } = req.params;

   const session = await Session.findByIdAndDelete(sessionId);
   if (!session) {
      req.flash('error', 'Sessão de Estudo não Encontrada!');
   }

   await Child.findByIdAndUpdate(id, { $pull: { sessions: sessionId } });

   await User.findByIdAndUpdate(req.user._id, { $pull: { sessions: sessionId } });

   req.flash('success', 'Sessão de Estudo excluída com sucesso!')
   res.redirect(`/criancas/${id}`)
}