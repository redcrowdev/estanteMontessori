const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const origin = ['Método', 'Personalizado']

const SessionTypeSchema = new Schema({
   name: {
      type: String,
      required: true
   },
   origin: {
      type: String,
      required: true,
      enum: origin,
      default: 'Personalizado'
   }
})

const SessionType = mongoose.model('SessionType', SessionTypeSchema);

module.exports = SessionType;