let express = require('express');
let path = require('path');
let favicon = require('serve-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');


//module for authentication
let session = require('express-session');
let passport = require('passport');
let passportLocal = require('passport-local');
let LocalStrategy = passportLocal.Strategy;
let flash = require('connect-flash');

//db
let mongoose = require('mongoose');
let configDB = require('./config/db');

mongoose.connect(process.env.URI || configDB.URI);

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log("Connected to MongoDB");
})


let index = require('./routes/index');
let user = require('./routes/user');

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /client
//app.use(favicon(path.join(__dirname, '../client', './')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../client')));

//session setup
app.use(session({
  secret: 'SomeSecret',
  saveUninitialized: true,
  resave: true
}));

//passport and flash setup
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use('/', index);
app.use('/user', user);

// passport user config
let UserModel = require('./models/users');
let User = UserModel.User;
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// catch 404 and forward to error handler
app.use((req, res, next) => {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;