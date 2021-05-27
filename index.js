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
      title: "Welcome, Hunter!",
      table1: "Mission",
      table1content: "<p>Vanguard is a specialized store in supplying Hunters with quality weapons, armors, charms, and other equipments and items that would necessary in their missions.</p> <p>This store was founded by not only a highly-skilled Craftsman, but a high-tier Hunter as well.</p>",
      table2: "Vision",
      table2content: "<p>Vanguard's aim is to supply every Hunter in the world with quality items so that the mortality rate of those heroes would decrease in the coming times. </p>"
  });
})

// launch app
app.use(express.static('public'));
app.listen(port, function() {
  console.log('App listening at port ' + port);
});