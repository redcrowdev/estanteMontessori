const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const origin = ['Método', 'Personalizado']

const FocusAreaSchema = new Schema({
   name: {
      type: String,
   },
   origin: {
      type: String,
      required: true,
      enum: origin,
      default: 'Método'
   }
})

const FocusArea = mongoose.model('FocusArea', FocusAreaSchema);

module.exports = FocusArea;