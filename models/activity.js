//File Requirements
const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

//Local variables
const sensiblePeriods = ['Movimento', 'Linguagem', 'Detalhes', 'Ordem', 'Desenvolvimento dos Sentidos', 'Refinamento dos Sentidos', 'Graça e Cortesia', 'Música e Ritmo', 'Escrita', 'Leitura', 'Matemática']

//Activity Schema
const ActivitySchema = new Schema({
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
      required: true,
      trim: true
   },
   owned: {
      type: String,
      required: true,
      default: 'Não'
   },
   picture: {
      url: {
         type: String,
         default: 'public/img/fatherhood.svg'
      },
      fileName: {
         type: String
      }
   },
   user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
   },
   date: {
      type: Date,
      default: Date.now()
      //required: true
   },
   reviews: [
      {
         type: Schema.Types.ObjectId,
         ref: 'Review'
      }
   ]
})


ActivitySchema.post('findOneAndDelete', async function (doc) {
   if (doc) {
      await Review.deleteMany({
         _id: {
            $in: doc.reviews
         }
      })
   }
})

//"Compile" Schema
const Activity = mongoose.model('Activity', ActivitySchema);

//Export module to be used elsewhere
module.exports = Activity;