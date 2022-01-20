//App requirements
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const Activity = require('./models/activity.js');
const appError = require('./appError');

//DB connection
mongoose.connect('mongodb://192.168.15.2:27017/estanteMontessori', {
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

// app.use(express.static('public'))
app.use('/public', express.static(path.join(__dirname, 'public')));


app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

//App routes (provisory)
app.get('/', (req, res) => {
   res.render('home')
})

app.get('/atividades', async (req, res, next) => {
   try {
      const activities = await Activity.find({});
      if (!activities) {
         throw new appError('Erro Interno de Servidor', 502);
      }
      res.render('atividades/index', { activities })
   } catch (err) {
      next(err)
   }
})

app.get('/atividades/nova-atividade', (req, res) => {
   res.render('atividades/nova-atividade')
})

app.post('/atividades', async (req, res, next) => {
   try {
      const activity = new Activity(req.body.activity);
      await activity.save();
      res.redirect(`/atividades/${activity._id}`)
   } catch (err) {
      next(err)
   }
})

app.get('/atividades/:id', async (req, res, next) => {
   try {
      const activity = await Activity.findById(req.params.id)
      if (!activity) {
         throw new appError('Recurso Não Encontrado', 404);
      }
      res.render('atividades/detalhes', { activity });
   } catch (err) {
      next(err)
   }
});

app.get('/atividades/:id/editar', async (req, res, next) => {
   try {
      const activity = await Activity.findByIdAndUpdate(req.params.id)
      if (!activity) {
         throw new appError('Recurso Não Encontrado', 404);
      }
      res.render('atividades/editar', { activity });
   } catch (err) {
      next(err)
   }
});

app.put('/atividades/:id', async (req, res, next) => {
   try {
      const { id } = req.params;
      const activity = await Activity.findByIdAndUpdate(id, { ...req.body.activity });
      res.redirect(`/atividades/${activity._id}`)
   } catch (err) {
      next(err)
   }
})

app.delete('/atividades/:id', async (req, res, next) => {
   try {
      const { id } = req.params;
      await Activity.findByIdAndDelete(id);
      res.redirect('/atividades');
   } catch (err) {
      next(err)
   }
})

// Page not found handler
app.use((req, res) => {
   res.status(404).render('404')
})

//Very basic error handling
app.use((err, req, res, next) => {
   const { status = 500 } = err;
   if (status == 404) {
      res.status(status).render('404')
   } else {
      res.status(status).render('500')
   }
})

//App service
app.listen(3000, () => {
   console.log('Serving on port 3000')
})