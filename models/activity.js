//File Requirements
const mongoose = require('mongoose')

//Local variables
const sensiblePeriods = ['Movimento', 'Linguagem', 'Detalhes', 'Ordem', 'Desenvolvimento dos Sentidos', 'Refinamento dos Sentidos', 'Graça e Cortesia', 'Música e Ritmo', , 'Escrita', 'Leitura', 'Matemática']

//Activity Schema
const ActivitySchema = new mongoose.Schema({
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
      //enum limits the options to those inside the array
      enum: sensiblePeriods,
      required: true
   },
   category: {
      type: String,
   },
   theme: {
      type: String,
   },
   description: {
      type: String,
      required: true
   },
   owned: {
      type: Boolean,
      required: true,
      default: false
   },
   picture: {
      type: String,
      default: 'files/img/fatherhood.svg'
   }
})

//"Compile" Schema
const Activity = mongoose.model('Activity', ActivitySchema);

//Export module to be used elsewhere
module.exports = Activity;