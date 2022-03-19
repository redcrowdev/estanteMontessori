const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const origin = ['Método', 'Personalizado']

const SensiblePeriodSchema = new Schema({
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

const SensiblePeriod = mongoose.model('SensiblePeriod', SensiblePeriodSchema);

module.exports = SensiblePeriod;