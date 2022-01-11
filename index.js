//App requirements
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Activity = require('./models/activity.js');

//DB connection
mongoose.connect('mongodb://192.168.15.2:27017/estanteMontessori', {
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

app.use(express.urlencoded({ extended: true }))

//App routes (provisory)
app.get('/', (req, res) => {
   res.render('home')
})

app.get('/atividades/nova-atividade', (req, res) => {
   res.render('atividades/nova-atividade')
})

app.get('/atividades', async (req, res) => {
   const activities = await Activity.find({});
   res.render('atividades/index', { activities })
})



app.get('/atividades/:id', async (req, res) => {
   const activity = await Activity.findById(req.params.id)
   res.render('atividades/detalhes', { activity });
});


//App service
app.listen(3000, () => {
   console.log('Serving on port 3000')
})