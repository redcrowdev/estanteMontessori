const Child = require('../models/child.js');
const Parent = require('../models/parent.js');
const User = require('../models/user.js');
const AppError = require('../utils/errorHandling');

module.exports.newForm = async (req, res) => {
   const child = await Child.findById(req.params.id);
   if (!child) {
      req.flash('error', 'Criança não encontrada!');
   }
   res.render('criancas/novo-responsavel', { child })
}


module.exports.create = async (req, res) => {
   const child = await Child.findById(req.params.id);
   if (!child) {
      req.flash('error', 'Criança não encontrada!');
   }
   const parent = new Parent(req.body.parent);
   if (!parent) {
      req.flash('error', 'Não foi possível incluir o Responsável Legal!');
   }
   const user = await User.findById(req.user._id); //incluído aqui
   parent.user = req.user._id;
   user.parents.push(parent); //incluído aqui
   child.parents.push(parent);
   await parent.save();
   await child.save();
   await user.save(); //incluído aqui
   req.flash('success', 'Responsável incluído com sucesso!')
   res.redirect(`/criancas/${child._id}`)
}

module.exports.canEdit = async (req, res, next) => {
   const { id, parentId } = req.params;
   const parent = await Parent.findById(parentId);
   if (!parent.user.equals(req.user._id)) {
      req.flash('error', 'Você não tem permissão para executar esta ação!!!')
      return res.redirect(`/criancas/${id}`);
   }
   next();
}

module.exports.editForm = async (req, res) => {
   const child = await Child.findById(req.params.id);
   if (!child) {
      req.flash('error', 'Criança não encontrada!');
   }
   const parent = await Parent.findById(req.params.parentId);
   if (!parent) {
      req.flash('error', 'Responsável não Encontrado!');
   }
   res.render('criancas/editar-responsavel', { child, parent });
}

module.exports.editData = async (req, res) => {
   const { id, parentId } = req.params;
   const parent = await Parent.findByIdAndUpdate(parentId, { ...req.body.parent });
   if (!parent) {
      req.flash('error', 'Responsável não Encontrado!');
   }
   req.flash('success', 'Sessão de Estudo editada com sucesso!')
   res.redirect(`/criancas/${id}`);
}

module.exports.canDelete = async (req, res, next) => {
   const { id, parentId } = req.params;
   const parent = await Parent.findById(parentId);
   if (req.user.isAdmin == false && !parent.user.equals(req.user._id)) {
      req.flash('error', 'Você não tem permissão para executar esta ação!!!')
      return res.redirect(`/criancas/${id}`);
   }
   next();
}

module.exports.delete = async (req, res) => {
   const { id, parentId } = req.params;

   const parent = await Parent.findByIdAndDelete(parentId);
   if (!parent) {
      req.flash('error', 'Responsável não encontrado!');
   }

   await Child.findByIdAndUpdate(id, { $pull: { parents: parentId } });

   await User.findByIdAndUpdate(req.user._id, { $pull: { parents: parentId } });

   req.flash('success', 'Responsável excluído com sucesso!')
   res.redirect(`/criancas/${id}`)
}