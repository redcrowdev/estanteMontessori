//App requirements
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const { joiActivitySchema } = require('./validationSchemas.js')
const wrapAsync = require('./utils/wrapAsync');
const AppError = require('./utils/errorHandling');
const Activity = require('./models/activity.js');
const Review = require('./models/review.js');
const Child = require('./models/child.js');
const Session = require('./models/session.js');
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

const validateChild = (req, res, next) => {
   const { error } = joiChildSchema.validate(req.body);
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

app.get('/criancas', wrapAsync(async (req, res, next) => {
   const children = await Child.find({});
   if (!children) {
      throw new AppError('Erro Interno de Servidor', 502);
   }
   res.render('criancas/index', { children })
}))

app.get('/atividades/nova-atividade', (req, res) => {
   res.render('atividades/nova-atividade')
})

app.get('/criancas/nova-crianca', (req, res) => {
   res.render('criancas/nova-crianca')
})

app.post('/atividades', validateActivity, wrapAsync(async (req, res, next) => {
   const activity = new Activity(req.body.activity);
   await activity.save();
   res.redirect(`/atividades/${activity._id}`)
}))

app.post('/criancas', wrapAsync(async (req, res, next) => {
   const child = new Child(req.body.child);
   await child.save();
   res.redirect(`/criancas/${child._id}`)
}))

app.get('/atividades/:id', wrapAsync(async (req, res, next) => {
   const activity = await Activity.findById(req.params.id).populate('reviews')
   if (!activity) {
      throw new AppError('Recurso Não Encontrado', 404);
   }
   res.render('atividades/detalhes', { activity });
}))

app.get('/criancas/:id', wrapAsync(async (req, res, next) => {
   const child = await Child.findById(req.params.id).populate('sessions')
   if (!child) {
      throw new AppError('Recurso Não Encontrado', 404);
   }
   res.render('criancas/detalhes', { child });
}))

app.get('/atividades/:id/editar', wrapAsync(async (req, res, next) => {
   const activity = await Activity.findByIdAndUpdate(req.params.id)
   if (!activity) {
      throw new AppError('Recurso Não Encontrado', 404);
   }
   res.render('atividades/editar', { activity });
}))

app.get('/criancas/:id/editar', wrapAsync(async (req, res, next) => {
   const child = await Child.findById(req.params.id)
   if (!child) {
      throw new AppError('Recurso Não Encontrado', 404);
   }
   res.render('criancas/editar', { child });
}))

app.put('/atividades/:id', validateActivity, wrapAsync(async (req, res, next) => {
   const { id } = req.params;
   const activity = await Activity.findByIdAndUpdate(id, { ...req.body.activity });
   res.redirect(`/atividades/${activity._id}`)
}))

app.put('/criancas/:id', wrapAsync(async (req, res, next) => {
   const { id } = req.params;
   const child = await Child.findByIdAndUpdate(id, { ...req.body.child });
   res.redirect(`/criancas/${child._id}`)
}))

app.delete('/atividades/:id', wrapAsync(async (req, res, next) => {
   const { id } = req.params;
   await Activity.findByIdAndDelete(id);
   res.redirect('/atividades');
}))

app.delete('/criancas/:id', wrapAsync(async (req, res, next) => {
   const { id } = req.params;
   await Child.findByIdAndDelete(id);
   res.redirect('/criancas');
}))

app.post('/atividades/:id/reviews', wrapAsync(async (req, res) => {
   const activity = await Activity.findById(req.params.id);
   const review = new Review(req.body.review);
   activity.reviews.push(review);
   await review.save();
   await activity.save();
   res.redirect(`/atividades/${activity._id}`)
}))

app.post('/criancas/:id/sessions', wrapAsync(async (req, res) => {
   const child = await Child.findById(req.params.id);
   const session = new Session(req.body.session);
   child.sessions.push(session);
   await session.save();
   await child.save();
   res.redirect(`/criancas/${child._id}`)
}))

app.get('/atividades/:id/reviews/:reviewId', wrapAsync(async (req, res) => {
   const activity = await Activity.findById(req.params.id);
   const review = await Review.findById(req.params.reviewId);
   if (!activity) {
      throw new AppError('Recurso Não Encontrado', 404);
   }
   res.render('atividades/editar-review', { activity, review });
}))

app.get('/criancas/:id/sessoes/:sessionId', wrapAsync(async (req, res) => {
   const child = await Child.findById(req.params.id);
   const session = await Session.findById(req.params.sessionId);
   if (!child) {
      throw new AppError('Recurso Não Encontrado', 404);
   }
   res.render('criancas/editar-sessao', { child, session });
}))

app.put('/atividades/:id/reviews/:reviewId', wrapAsync(async (req, res) => {
   const { id, reviewId } = req.params;
   await Review.findByIdAndUpdate(reviewId, { ...req.body.review });
   res.redirect(`/atividades/${id}`);
}))

app.put('/criancas/:id/sessoes/:sessionId', wrapAsync(async (req, res) => {
   const { id, sessionId } = req.params;
   await Session.findByIdAndUpdate(sessionId, { ...req.body.session });
   res.redirect(`/criancas/${id}`);
}))

app.delete('/atividades/:id/reviews/:reviewId', wrapAsync(async (req, res) => {
   const { id, reviewId } = req.params;
   await Activity.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
   await Review.findByIdAndDelete(reviewId);
   res.redirect(`/atividades/${id}`)
}))

app.delete('/criancas/:id/sessoes/:sessionId', wrapAsync(async (req, res) => {
   const { id, sessionId } = req.params;
   await Child.findByIdAndUpdate(id, { $pull: { sessions: sessionId } });
   await Session.findByIdAndDelete(sessionId);
   res.redirect(`/criancas/${id}`)
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
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
   console.log(`Serving on port ${PORT}`)
})