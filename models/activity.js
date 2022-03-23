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
      default: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Modi totam quia facilis nam dolore porro itaque expedita quas. Quas sapiente qui quibusdam molestiae necessitatibus earum aut dicta quia, repudiandae autem?'
   },
   owned: {
      type: String,
      required: true,
      default: 'Não'
   },
   picture: {
      type: String,
      default: 'fatherhood.svg'
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