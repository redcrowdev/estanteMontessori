//App requirements
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Activity = require('./models/activity.js');

//DB connection
mongoose.connect('mongodb://localhost:27017/estanteMontessori', {
   useNewUrlParser: true,
   useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
   console.log('Database Connected');
});

//App configuration
const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//App routes (provisory)
app.get('/', (req, res) => {
   res.render('home')
})

app.get('/activities', async (req, res) => {
   const hostels = await Activity.find({});
   res.render('atividades/index')
})


//App service
app.listen(3000, () => {
   console.log('Serving on port 3000')
})