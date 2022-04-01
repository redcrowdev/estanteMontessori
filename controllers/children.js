const Child = require('../models/child.js');

module.exports.showList = async (req, res, next) => {
   const children = await Child.find({}).populate('user').populate({
      path: 'sessions',
      populate: {
         path: 'user'
      }
   });
   if (!children) {
      //throw new AppError('Erro Interno de Servidor', 502);
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
      req.flash('error', 'Erro ao criar a criança!')
      res.redirect('/criancas/index')
   }
   child.user = req.user._id;
   await child.save();
   req.flash('success', 'Criança criada com sucesso!')
   res.redirect(`/criancas/${child._id}`)
}

module.exports.details = async (req, res, next) => {
   const child = await Child.findById(req.params.id).populate('sessions').populate('user');
   if (!child) {
      req.flash('error', 'Criança não encontrada!!')
      res.redirect('/criancas/index')
   }
   res.render('criancas/detalhes', { child });
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
   const child = await Child.findByIdAndUpdate(id, { ...req.body.child });
   if (!child) {
      req.flash('error', 'Criança não encontrada!!')
      res.redirect('/criancas/index')
   }
   req.flash('success', 'Criança editada com sucesso!')
   res.redirect(`/criancas/${child._id}`)
}

module.exports.delete = async (req, res, next) => {
   const { id } = req.params;
   const child = await Child.findByIdAndDelete(id);
   if (!child) {
      req.flash('error', 'Criança não encontrada!!')
      res.redirect('/criancas/index')
   }
   req.flash('success', 'Criança excluida com sucesso!')
   res.redirect('/criancas');
}