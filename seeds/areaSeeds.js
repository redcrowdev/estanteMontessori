const mongoose = require('mongoose');
const FocusArea = require('../models/focusArea');

mongoose.connect('mongodb://192.168.15.2:27017/estanteMontessori', {
   useNewUrlParser: true,
   useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
   console.log('Database Connected');
});

const focusSeeds = [
   {
      name: 'Focalização da Atenção'
   },
   {
      name: 'Limitação de Movimentos'
   },
   {
      name: 'Uso das Mãos'
   },
   {
      name: 'Repetição'
   },
   {
      name: 'Precisão'
   },
   {
      name: 'Prazer no Trabalho Escolhido'
   }
]

const seedDB = async () => {
   await FocusArea.deleteMany({});
   await FocusArea.insertMany(focusSeeds);
}

seedDB().then(() => {
   mongoose.connection.close();
})