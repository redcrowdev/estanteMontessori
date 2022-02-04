//App requirements
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const { joiActivitySchema } = require('./validationSchemas.js')
const wrapAsync = require('./utils/wrapAsync');
const AppError = require('./utils/errorHandling');
const Activity = require('./models/activity.js');


//DB connection
const dbConnection = 'mongodb+srv://redcrowdev:p6M9UhYvr3ERHijV@cluster0.rmpqi.mongodb.net/estanteMontessori?retryWrites=true&w=majority'
//const dbConnection = 'mongodb://192.168.15.2:27017/estanteMontessori'

mongoose.connect(dbConnection, {
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

//Custom Middlewares
const validateActivity = (req, res, next) => {
   const { error } = joiActivitySchema.validate(req.body);
   if (error) {
      const errmsg = error.details.map(element => element.message).join(',')
      throw new AppError(errmsg, 400)
   } else {
      next();
   }
}

//App routes (provisory)
app.get('/', (req, res) => {
   res.render('home')
})

app.get('/atividades', wrapAsync(async (req, res, next) => {
   const activities = await Activity.find({});
   if (!activities) {
      throw new AppError('Erro Interno de Servidor', 502);
   }
   res.render('atividades/index', { activities })
}))

app.get('/atividades/nova-atividade', (req, res) => {
   res.render('atividades/nova-atividade')
})

app.post('/atividades', validateActivity, wrapAsync(async (req, res, next) => {
   const activity = new Activity(req.body.activity);
   await activity.save();
   res.redirect(`/atividades/${activity._id}`)
}))

app.get('/atividades/:id', wrapAsync(async (req, res, next) => {
   const activity = await Activity.findById(req.params.id)
   if (!activity) {
      throw new AppError('Recurso Não Encontrado', 404);
   }
   res.render('atividades/detalhes', { activity });

}))

app.get('/atividades/:id/editar', wrapAsync(async (req, res, next) => {
   const activity = await Activity.findByIdAndUpdate(req.params.id)
   if (!activity) {
      throw new AppError('Recurso Não Encontrado', 404);
   }
   res.render('atividades/editar', { activity });
}))

app.put('/atividades/:id', validateActivity, wrapAsync(async (req, res, next) => {
   const { id } = req.params;
   const activity = await Activity.findByIdAndUpdate(id, { ...req.body.activity });
   res.redirect(`/atividades/${activity._id}`)

}))

app.delete('/atividades/:id', wrapAsync(async (req, res, next) => {
   const { id } = req.params;
   await Activity.findByIdAndDelete(id);
   res.redirect('/atividades');
}))

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
//const appPort = 3000
const appPort = 80
app.listen(appPort, () => {
   console.log('Serving on port 3000')
})