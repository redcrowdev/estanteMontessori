//App requirements
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
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
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

//App routes (provisory)
app.get('/', (req, res) => {
   res.render('home')
})

app.get('/atividades', async (req, res) => {
   const activities = await Activity.find({});
   res.render('atividades/index', { activities })
})

app.get('/atividades/nova-atividade', (req, res) => {
   res.render('atividades/nova-atividade')
})

app.post('/atividades', async (req, res) => {
   const activity = new Activity(req.body.activity);
   await activity.save();
   res.redirect(`/atividades/${activity._id}`)
})

app.get('/atividades/:id', async (req, res) => {
   const activity = await Activity.findById(req.params.id)
   res.render('atividades/detalhes', { activity });
});

app.get('/atividades/:id/editar', async (req, res) => {
   const activity = await Activity.findByIdAndUpdate(req.params.id)
   res.render('atividades/editar', { activity });
});

app.put('/atividades/:id', async (req, res) => {
   const { id } = req.params;
   const activity = await Activity.findByIdAndUpdate(id, { ...req.body.activity });
   res.redirect(`/atividades/${activity._id}`)
})

app.delete('/atividades/:id', async (req, res) => {
   const { id } = req.params;
   await Activity.findByIdAndDelete(id);
   res.redirect('/atividades');
})

// Page not found handler
app.use((req, res) => {
   res.status(404).send('Não Encontrado!')
})

//App service
app.listen(3000, () => {
   console.log('Serving on port 3000')
})