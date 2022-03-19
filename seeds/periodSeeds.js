const mongoose = require('mongoose');
const SensiblePeriod = require('../models/sensiblePeriod');

mongoose.connect('mongodb://192.168.15.2:27017/estanteMontessori', {
   useNewUrlParser: true,
   useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
   console.log('Database Connected');
});

const periodSeeds = [
   {
      name: 'Linguagem'
   },
   {
      name: 'Detalhes'
   },
   {
      name: 'Ordem'
   },
   {
      name: 'Desenvolvimento dos Sentidos'
   },
   {
      name: 'Refinamento dos Sentidos'
   },
   {
      name: 'Graça e Cortesia'
   },
   {
      name: 'Música e Ritmo'
   },
   {
      name: 'Escrita'
   },
   {
      name: 'Leitura'
   },
   {
      name: 'Matemática'
   }
]

const seedDB = async () => {
   await SensiblePeriod.deleteMany({});
   await SensiblePeriod.insertMany(periodSeeds);
}

seedDB().then(() => {
   mongoose.connection.close();
})