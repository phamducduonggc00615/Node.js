const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const fs = require('fs');
var path = require('path');
var _ = require('lodash');
// khai bao su dung JSON
const JSONStream = require('JSONStream');
var engine = require('consolidate');

app.engine('hbs',engine.handlebars);
app.set('views', './views');
app.use('/profilepics', express.static('images'));

// app.set('view engine', 'hbs');
app.set('view engine', 'ejs');

// ho tro tieng viet unicode
app.use(bodyParser.urlencoded({ extended: true }));

// get all 
app.get('/',(req, res)=>{
    let users = [];
    fs.readdir('users', function (err, files){
        if(err) throw err;
        files.forEach(function(file){
            fs.readFile(path.join( __dirname ,'users', file), {encoding: 'utf-8'}, function(err,data){
                if (err) throw err
                const user = JSON.parse(data);
                user.name.full = _.startCase(user.name.first + '' + user.name.last);
                users.push(user);
                if(users.length === files.length)
                    res.render('index', {users: users})
            })
        })
    })
})

app.listen(3000,()=>{console.log("App running at port 3000");})