const Tool = require('../models/tool.js');
const User = require('../models/user.js');
const SensiblePeriod = require('../models/sensiblePeriod.js')

module.exports.showList = async (req, res, next) => {
   const tools = await Tool.find({}).sort({ "title": -1 });
   if (!tools) {
      req.flash('error', 'Ferramentas não encontradas!')
      res.redirect('/home')
   }
   res.render('ferramentas/index', { tools })
}

module.exports.newForm = async (req, res) => {
   const sensiblePeriod = await SensiblePeriod.find({}).sort({ title: -1 })
   res.render('ferramentas/nova-ferramenta', { sensiblePeriod })
}

module.exports.create = async (req, res, next) => {
   const tool = new Tool(req.body.tool);
   if (!tool) {
      req.flash('error', 'Erro ao criar a Ferramenta!')
      return res.redirect('/ferramentas')
   }
   const user = await User.findById(req.user._id);
   if (req.file) {
      tool.picture.url = req.file.path;
   }
   if (req.file) {
      tool.picture.fileName = req.file.filename;
   }
   tool.user = req.user._id;
   user.tools.push(tool);
   await tool.save();
   await user.save();
   req.flash('success', 'Ferramenta criada com sucesso!')
   res.redirect('/ferramentas')
}

module.exports.canEdit = async (req, res, next) => {
   const { id } = req.params;
   const tool = await Tool.findById(id);
   if (!tool.user.equals(req.user._id)) {
      req.flash('error', 'Você não tem permissão para executar esta ação!!!')
      return res.redirect(`/ferramentas`);
   }
   next();
}

module.exports.editForm = async (req, res, next) => {
   const { id } = req.params;
   const tool = await Tool.findById(id)
   const sensiblePeriod = await SensiblePeriod.find({}).sort({ title: -1 })
   if (!tool) {
      req.flash('error', 'Ferramenta não encontrada!')
      return res.redirect('/ferramentas')
   }
   res.render('ferramentas/editar', { tool, sensiblePeriod });
}

module.exports.editData = async (req, res, next) => {
   const { id } = req.params;
   const tool = await Tool.findById(id);
   if (!tool) {
      req.flash('error', 'Erro ao editar a Ferramenta!')
      return res.redirect('/ferramentas')
   }
   if (req.file) {
      tool.picture.url = req.file.path;
   }
   if (req.file) {
      tool.picture.fileName = req.file.filename;
   }
   await tool.updateOne({ ...req.body.tool });
   await tool.save()
   req.flash('success', 'Ferramenta editada com sucesso!')
   res.redirect(`/ferramentas`)
}

module.exports.canDelete = async (req, res, next) => {
   const { id } = req.params;
   const tool = await Tool.findById(id);
   if (req.user.isAdmin == false && !tool.user.equals(req.user._id)) {
      req.flash('error', 'Você não tem permissão para executar esta ação!!!')
      return res.redirect(`/ferramentas`);
   }
   next();
}

module.exports.delete = async (req, res, next) => {
   const { id } = req.params;
   const tool = await Tool.findById(id);
   if (!tool) {
      req.flash('error', 'Erro ao excluir a Ferramenta!')
      return res.redirect('/ferramentas')
   }

   await User.findByIdAndUpdate(req.user._id, { $pull: { tools: id } })
   await Tool.findByIdAndDelete(id);
   req.flash('success', 'Ferramenta excluída com sucesso!')
   res.redirect('/ferramentas');
}