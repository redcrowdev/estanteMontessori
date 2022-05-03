const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ToolSchema = new Schema({
   title: {
      type: String,
      required: true
   },
   ages: {
      type: String,
      required: true
   },
   sensiblePeriod: {
      type: String,
      enum: ['Movimento', 'Linguagem', 'Detalhes', 'Ordem', 'Desenvolvimento dos Sentidos', 'Refinamento dos Sentidos', 'Graça e Cortesia', 'Música e Ritmo', 'Escrita', 'Leitura', 'Matemática'],
      required: true,
      trim: true
   },
   description: {
      type: String,
      required: true,
      trim: true
   },
   owned: {
      type: String,
      required: true,
      default: 'Não'
   },
   picture: {
      type: String,
      default: 'play_time.svg'
   },
   user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
   },
   date: {
      type: Date,
      default: Date.now()
   }
})

const Tool = mongoose.model('Tool', ToolSchema);

module.exports = Tool;
