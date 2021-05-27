// packages
const express = require('express');
const hbs = require('express-handlebars')

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

// routes
app.get('/', function(req, res){
  res.render('home',{
    title: 'Vanguard',
    desc: 'Specialized store in supplying hunters with quality equipment and items for missions',
    img: '/images/Vanguard.png',
    alt_text: 'Vanguard Logo',
  });
})

app.get('/login', function(req, res){
  res.render('login', {
    title: 'Sign In',
    img: '/images/Vanguard.png',
    alt_text: 'Vanguard Logo',
  })
})

app.get('/register', function(req, res){
  res.render('register', {
    title: 'Create a New Account',
    img: '/images/Vanguard.png',
    alt_text: 'Vanguard Logo',
  })
})

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