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

app.get('/', function(req, res){
  res.render('home',{
    title: 'Vanguard'
  });
})

app.get('/login', function(req, res){
  res.render('login', {
    title: 'Vanguard'
  })
})

// launch app
app.use(express.static('public'));
app.listen(port, function() {
  console.log('App listening at port ' + port);
});