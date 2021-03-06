if (process.env.NODE_ENV !== 'production') {
   require('dotenv').config();
}

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
const parentRoutes = require('./routes/parents.js');
const usersRoutes = require('./routes/users.js');
const metricsRoutes = require('./routes/metrics.js');
const toolsRoutes = require('./routes/tools.js');

const dbURL = process.env.dbURL;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const googleCallbackURL = process.env.googleCallbackURL;
const mySecret = process.env.mySecret;

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
   secret: mySecret,
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
// passport.use(new localStrategy(User.authenticate()));
passport.use(new localStrategy({
   usernameField: 'email'
}, User.authenticate()));
passport.use(new GoogleStrategy({
   clientID: GOOGLE_CLIENT_ID,
   clientSecret: GOOGLE_CLIENT_SECRET,
   callbackURL: googleCallbackURL,
   passReqToCallback: true
},
   async function (request, accessToken, refreshToken, profile, done) {

      const getUser = User.findOne({ email: profile.email });

      if (!getUser) {
         const username = profile.email.substring(0, profile.email.indexOf('@'));
         console.log(username);
         User.findOrCreate({ googleId: profile.id, email: profile.email, fName: profile.given_name, lName: profile.family_name, username: username }, function (err, user) {
            return done(err, user);
         });
      };
      User.findOne({ googleId: profile.id, email: profile.email }, function (err, user) {
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
app.use('/criancas/:id/responsaveis/', parentRoutes);
app.use('/', usersRoutes);
app.use('/indicadores', metricsRoutes);
app.use('/ferramentas', toolsRoutes);


app.get('/', (req, res) => {
   res.render('home')
})

app.get('/auth/google',
   passport.authenticate('google', {
      scope: ['email', 'profile']
   }));

app.get('/auth/google/callback', passport.authenticate('google', {
   successRedirect: '/atividades',
   failureRedirect: '/home'
}));

//App service
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
   console.log(`Serving on port ${PORT}`)
})