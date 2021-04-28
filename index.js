var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const session = require('express-session');
const fileStore = require('session-file-store')(session);
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
const cors = require('cors');

const config = require('./config');
const User = require('./models/user');

const user = require('./routes/user');
const homework = require('./routes/homeWork');

const url =config.mongoUrl;
const connect = mongoose.connect(url, {useNewUrlParser: true,useUnifiedTopology: true,usecreateIndexes: true});

connect.then((db) => {
  console.log('connected sucssesfully...');
}, (err) => { console.log(err) });

const app = express();
var _ = require('underscore');

function allowCrossDomain(req, res, next) {
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');

  var origin = req.headers.origin;
  if (_.contains(app.get('allowed_origins'), origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  if (req.method === 'OPTIONS') {
    res.send(200);
  } else {
    next();
  }
}

app.use(require('express-session')({
  secret: 'finally lets look',
  resave: false,
  saveUninitialized: false
}));
 app.use(allowCrossDomain);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use('/',user);


app.use('/homework',homework);
// function auth (req, res, next) {
//   console.log(req.user);

//   if (!req.user) {
//     var err = new Error('You are not authenticated!');
//     err.status = 403;
//     next(err);
//   }
//   else {
//     next();
//   }
// }
// app.use(auth);


app.listen(9000, () => {
    console.log('Express server started at port : 9000');
});
module.exports = app;