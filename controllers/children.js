const Child = require('../models/child.js');
const Parent = require('../models/parent.js');
const User = require("../models/user.js")
const FocusArea = require('../models/focusArea.js');
const SessionType = require('../models/sessionType.js');

module.exports.isChildOwner = async (req, res, next) => {
   const { id } = req.params;
   const child = await Child.findById(id);
   if (req.user.isAdmin == false && !child.user.equals(req.user._id)) {
      req.flash('error', 'Você não tem permissão para executar esta ação!!!')
      return res.redirect(`/criancas`);
   }
   next();
}

module.exports.showList = async (req, res, next) => {
   const children = await Child.find({}).sort({ firstName: 'asc', lastName: 'asc' }).populate('user').populate({
      path: 'sessions',
      populate: {
         path: 'user'
      }
   });
   if (!children) {
      req.flash('error', 'Crianças não encontradas!')
      res.redirect('/home')
   }
   res.render('criancas/index', { children })
}

module.exports.newForm = (req, res) => {
   res.render('criancas/nova-crianca')
}

module.exports.create = async (req, res, next) => {
   const child = new Child(req.body.child);
   if (!child) {
      req.flash('error', 'Erro ao gravar a Criança!!! Verifique os dados preenchidos para a Criança!')
      return res.redirect(`/criancas`)
   }
   const parent = new Parent(req.body.parent);
   if (!parent) {
      req.flash('error', 'Erro ao gravar a Criança!!! Verifique os dados preenchidos para o Responsável Legal!')
      return res.redirect(`/criancas`)
   }
   const user = await User.findById(req.user._id); //incluído aqui
   parent.user = req.user._id;
   child.user = req.user._id;
   if (req.file) {
      child.picture.url = req.file.path;
   }
   if (req.file) {
      child.picture.fileName = req.file.filename;
   }
   child.parents.push(parent);
   user.children.push(child); //incluído aqui
   user.parents.push(parent); //incluído aqui
   await parent.save();
   await child.save();
   await user.save(); //incluído aqui
   req.flash('success', 'Criança criada com sucesso!');
   return res.redirect(`/criancas/${child._id}`);
}

module.exports.details = async (req, res, next) => {
   const child = await Child.findById(req.params.id).populate('sessions').populate('user').populate('parents');
   const focusArea = await FocusArea.find({});
   const sessionType = await SessionType.find({});
   if (!child) {
      req.flash('error', 'Criança não encontrada!!')
      res.redirect('/criancas/index')
   }
   res.render('criancas/detalhes', { child, focusArea, sessionType });
}

module.exports.canEdit = async (req, res, next) => {
   const { id } = req.params;
   const child = await Child.findById(id);
   if (!child.user.equals(req.user._id)) {
      req.flash('error', 'Você não tem permissão para executar esta ação!!!')
      return res.redirect(`/criancas`);
   }
   next();
}

module.exports.editForm = async (req, res, next) => {
   const child = await Child.findById(req.params.id)
   if (!child) {
      req.flash('error', 'Criança não encontrada!!')
      res.redirect('/criancas/index')
   }
   res.render('criancas/editar', { child });
}

module.exports.editData = async (req, res, next) => {
   const { id } = req.params;
   const child = await Child.findById(id);
   if (!child) {
      req.flash('error', 'Criança não encontrada!!')
      res.redirect('/criancas/index')
   }
   if (req.file) {
      child.picture.url = req.file.path;
   }
   if (req.file) {
      child.picture.fileName = req.file.filename;
   }
   await child.updateOne({ ...req.body.child });
   await child.save()
   req.flash('success', 'Criança editada com sucesso!')
   res.redirect(`/criancas/${child._id}`)
}

module.exports.canDelete = async (req, res, next) => {
   const { id } = req.params;
   const child = await Child.findById(id);
   if (req.user.isAdmin == false && !child.user.equals(req.user._id)) {
      req.flash('error', 'Você não tem permissão para executar esta ação!!!')
      return res.redirect(`/criancas`);
   }
   next();
}

module.exports.delete = async (req, res, next) => {
   const { id } = req.params;
   const child = await Child.findById(id);
   if (!child) {
      req.flash('error', 'Criança não encontrada!!')
      res.redirect('/criancas/index')
   }

   const sessions = child.sessions;
   sessions.forEach(async session => {
      await User.findByIdAndUpdate(req.user._id, { $pull: { sessions: session } })
   });

   const parents = child.parents;
   parents.forEach(async parent => {
      await User.findByIdAndUpdate(req.user._id, { $pull: { parents: parent } })
   });

   await User.findByIdAndUpdate(req.user._id, { $pull: { children: id } })
   await Child.findByIdAndDelete(id)
   req.flash('success', 'Criança excluida com sucesso!')
   res.redirect('/criancas');
}