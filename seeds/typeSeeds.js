const mongoose = require('mongoose');
const SessionType = require('../models/sessionType');
const sessionType = require('../models/sessionType');

mongoose.connect('mongodb://192.168.15.2:27017/estanteMontessori', {
   useNewUrlParser: true,
   useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
   console.log('Database Connected');
});

const typeSeeds = [
   {
      name: 'Atividade'
   },
   {
      name: 'Interação Social'
   },
   {
      name: 'Livre Brincar'
   },
   {
      name: 'Emocional'
   },
   {
      name: 'Motricidade Fina'
   },
   {
      name: 'Motricidade Grossa'
   }
]

const seedDB = async () => {
   await SessionType.deleteMany({});
   await SessionType.insertMany(typeSeeds);
}

seedDB().then(() => {
   mongoose.connection.close();
})