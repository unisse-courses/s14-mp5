const express = require('express');
const app = express();
const port = 3000;

const hbs = require('express-handlebars');
app.set('view engine', 'hbs');

app.use(express.static('public'));

app.listen(port, function(){
    console.log('App listening at port ' + port);
})

    app.engine( 'hbs', hbs( {
        extname: 'hbs',
        defaultView: 'main',
        layoutsDir: __dirname + '/views/layouts/',
        partialsDir: __dirname + '/views/partials/'
    }));
    app.get('/login', function(req, res){
        res.render('login',{
            title: "Vanguard",
        });
    })
    app.get('/', function(req, res){
        res.render('home',{
            title: "Welcome, Hunter!",
            table1: "Mission",
            table1content: "<p>Vanguard is a specialized store in supplying Hunters with quality weapons, armors, charms, and other equipments and items that would necessary in their missions.</p> <p>This store was founded by not only a highly-skilled Craftsman, but a high-tier Hunter as well.</p>",
            table2: "Vision",
            table2content: "<p>Vanguard's aim is to supply every Hunter in the world with quality items so that the mortality rate of those heroes would decrease in the coming times. </p>"
        });
    })
    app.get('/profile', function(req, res){
        res.render('profile',{
            title: "Profile",
            name: "<b>Sung Jin-Woo</b>",
            id: "<b>Reawakened Hunter</b>",
            contact: "<b>Mobile Phone</b>: 0945-339-1241, <b>Email</b>: jinsung@soloing.org",
            desc: "Previously known as the World's Weakest Hunter and delved down the path of becoming the World's Strongest Hunter after he was Reawakened and became a Player.",
            img: 'img/Jin-Woo.png'
        });
    })
    app.get('/buying', function(req, res){
        res.render('buying',{
            title: "Market Place"
        });
    })
    app.get('/selling', function(req, res){
        res.render('selling',{
            title: "Inventory",
        });
    })

    