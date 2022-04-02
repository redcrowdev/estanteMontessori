//App requirements
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const localStrategy = require('passport-local');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const User = require('./models/user.js');
const findOrCreate = require("mongoose-findorcreate");

const activityRoutes = require('./routes/atividades.js');
const childrenRoutes = require('./routes/criancas.js');
const reviewsRoutes = require('./routes/reviews.js');
const sessionsRoutes = require('./routes/sessions.js');
const usersRoutes = require('./routes/users.js');
//const { findById } = require('./models/activity.js');

//DB connection

const dbURL = process.env.dbConnection
//const dbURL = 'mongodb://192.168.15.2:27017/estanteMontessori'
//const dbURL = 'mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000'

const GOOGLE_CLIENT_ID = process.env.googleClientId
const GOOGLE_CLIENT_SECRET = process.env.googleClientSecret
const googleCallbackURL = `http://estante-montessori.herokuapp.com/auth/google/callback`

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
const sessionConfig = {
   secret: 'mygreatsecretofall',
   resave: false,
   saveUninitialized: true,
   cookie: {
      httpOnly: true,
      expires: Date.now() + 1000 * 60 * 60 * 24,
      maxAge: 1000 * 60 * 60 * 24
   }
};
app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
//passport.use(new localStrategy(User.authenticate()));
passport.use(new GoogleStrategy({
   clientID: GOOGLE_CLIENT_ID,
   clientSecret: GOOGLE_CLIENT_SECRET,
   callbackURL: googleCallbackURL,
   // callbackURL: "http://localhost:3000/auth/google/callback",
   // callbackURL: process.env.NODE_ENV === "production"
   //    ? `${HOST}/${RETURN_URL}`
   //    : `${HOST}:${PORT}/${RETURN_URL}`,
   passReqToCallback: true
},
   function (request, accessToken, refreshToken, profile, done) {
      User.findOrCreate({ googleId: profile.id, email: profile.email }, function (err, user) {
         return done(err, user);
      });
   }
));
passport.serializeUser((user, done) => {
   done(null, user)
});
passport.deserializeUser((user, done) => {
   done(null, user)
});

app.use((req, res, next) => {
   res.locals.currentUser = req.user;
   res.locals.success = req.flash('success');
   res.locals.error = req.flash('error');
   next();
});

//App routes
app.use('/atividades', activityRoutes);
app.use('/atividades/:id/reviews', reviewsRoutes);
app.use('/criancas', childrenRoutes);
app.use('/criancas/:id/sessoes/', sessionsRoutes);
app.use('/', usersRoutes);

app.get('/', (req, res) => {
   res.render('home')
})

app.get('/auth/google',
   passport.authenticate('google', {
      scope: ['email', 'profile']
   }));

app.get('/auth/google/callback', passport.authenticate('google', {
   successRedirect: '/atividades',
   failureRedirect: '/login'
}));

// Page not found handler
// app.all('*', (req, res, next) => {
//    next(new AppError('Recurso Não Localizado', 404))
// })

// app.all('*', (req, res, next) => {
//    next(new AppError('Erro de Requisição', 404))
//    res.redirect('/atividades')
// })

// app.use((err, req, res, next) => {
//    const { status = 500 } = err
//    if (!err.message) {
//       err.message = 'Internal Server Error.'
//    }
//    //res.status(status).send(`Erro ${status}: ${message}`)
//    //console.log(err)
//    res.status(status).render('error', { err })
// })



//Very basic error handling
// app.use((err, req, res, next) => {
//    const { status = 500 } = err
//    if (!err.message) {
//       err.message = 'Internal Server Error.'
//    }
//    //res.status(status).send(`Erro ${status}: ${message}`)
//    //console.log(err)
//    res.status(status).render('error', { err })
// })

//App service
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
   console.log(`Serving on port ${PORT}`)
})