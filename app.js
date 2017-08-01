const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const fs = require('fs');
var path = require('path');
var _ = require('lodash')
const JSONStream = require('JSONStream');
var engines = require('consolidate');
app.engine('hbs', engines.handlebars);
app.set('view engine', 'hbs')
// set the view engine to ejs
//app.set('view engine', 'ejs');
app.set('views', './views');
app.use('/profilepics', express.static('images')); // lay anh
app.use(express.static(__dirname + '/public')); // 
app.use(bodyParser.json()); // khai bao su dung ham .Json()
app.use(bodyParser.urlencoded({ extended: true })); 
app.get('/', (req, res) => {
    let users = [];
    fs.readdir('users', function (err, files) {
        if (err) throw err
        files.forEach(function (file) {
            fs.readFile(path.join(__dirname, 'users', file), { encoding: 'utf8' }, function (err, data) {
                if (err) throw err
                const user = JSON.parse(data);
                user.name.full = _.startCase(user.name.first + ' ' + user.name.last);
                users.push(user);
                if (users.length === files.length)
                    //res.send(users);
                    res.render('index', { users: users })
            })
        })
    })
})

app.get('/:username', function (req, res) {
    var username = req.params.username
    var user = getUser(username)
    //res.send(user);

    res.render('user', {
        user: user,
        address: user.location
    })
})

app.put('/:username', (req, res) => {
    var username = req.params.username
    var user = getUser(username)
    user.location = req.body
    saveUser(username, user)
    res.end()
})

app.delete('/:username', function (req, res) {
    var fp = getUserFilePath(req.params.username)
    fs.unlinkSync(fp) // delete file
    res.sendStatus(200)
})

function getUser(userName) {
    var user = JSON.parse(fs.readFileSync(getUserFilePath(userName), { encoding: 'utf8' }))
    user.name.full = _.startCase(user.name.first + ' ' + user.name.last)
    _.keys(user.location).forEach(function (key) {
        user.location[key] = _.startCase(user.location[key])
    })
    return user
}
function saveUser(username, data) {
    var fp = getUserFilePath(username)
    fs.unlinkSync(fp) // delete the file
    fs.writeFileSync(fp, JSON.stringify(data, null, 2), { encoding: 'utf8' })
}

function getUserFilePath(userName) {
    return path.join(__dirname, 'users', userName) + '.json';
}



app.listen(3000, () => { console.log("App running at port 3000"); })