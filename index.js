//App requirements
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');

const atividades = require('./routes/atividades.js')
const criancas = require('./routes/criancas.js')
const reviews = require('./routes/reviews.js')
const sessoes = require('./routes/sessions.js')
//const { findById } = require('./models/activity.js');


//DB connection

//const dbURL = process.env.dbConnection
const dbURL = 'mongodb://192.168.15.2:27017/estanteMontessori'
//const dbURL = 'mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000'

mongoose.connect(dbURL, {
   useNewUrlParser: true,
   useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection Error'));
db.once('open', () => {
   console.log('Database Connected');
});

//App configuration
const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

//App routes
app.use('/atividades', atividades)
app.use('/atividades/:id/reviews', reviews)
app.use('/criancas', criancas)
app.use('/criancas/:id/sessoes/', sessoes)

app.get('/', (req, res) => {
   res.render('home')
})

// Page not found handler
app.all('*', (req, res, next) => {
   next(new AppError('Recurso Não Localizado', 404))
})

//Very basic error handling
app.use((err, req, res, next) => {
   const { status = 500 } = err
   if (!err.message) {
      err.message = 'Internal Server Error.'
   }
   //res.status(status).send(`Erro ${status}: ${message}`)
   res.status(status).render('error', { err })
})

//App service
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
   console.log(`Serving on port ${PORT}`)
})