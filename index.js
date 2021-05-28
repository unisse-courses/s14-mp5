// packages
const express = require('express');
const hbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('./models/connection');
const session = require('express-session');
const flash = require('connect-flash');
const MongoStore = require('connect-mongo');

// express application
const app = express();
const port = 5000;

// express-handlebars view engine
app.engine('hbs', hbs({
  extname: 'hbs',
  defaultView: 'main',
  layoutsDir: __dirname + '/views/layouts/',
  partialsDir: __dirname + '/views/partials/'
}));
app.set('view engine', 'hbs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// declare sessions - server config
app.use(session({
  secret: 'somegibberishsecret',
  store: MongoStore.create({mongoUrl: "mongodb+srv://admin:1234@vanguarddb.gnxke.mongodb.net/vanguard?retryWrites=true&w=majority"}),
  resave: false,
  saveUninitialized: true,
  cookie: {secure: false, maxAge: 1000 * 60 * 60 * 24 * 7}
}));

// declare flash
app.use(flash());

// global variables
app.use(function(req, res, next) {
  res.locals.session = req.session;
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.isAuthenticated = req.session.user ? true : false;
  next();
});

// routes
const userRouter = require('./routes/userRoutes');
const authRouter = require('./routes/authRoutes');

app.use('/', userRouter);
app.use('/', authRouter);

app.get('/marketplace', function(req, res){
  res.render('marketplace', {
    title: 'Marketplace'
  })
})

// launch app
app.use(express.static('public'));
app.listen(port, function() {
  console.log('App listening at port ' + port);
});