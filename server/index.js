var express = require('express');
var morgan = require('morgan');
var parser = require('body-parser');
var cors = require('cors');

var controller = require('./controllers');

var app = express();
let port = process.env.PORT || 4000;

app.set('port',port);
app.use(parser.json());
app.use(parser.urlencoded({ extended: false }));
app.use(cors());
app.use(morgan('dev'));


app.use(express.static(__dirname + '/../client/dist'));

// app.get('/users');
// app.post('/users');

app.get('/rooms', controller.rooms.get);
app.post('/rooms');

app.get('/messages', controller.messages.get);
app.post('/messages', controller.messages.post);

app.post('/login',controller.users.get)
app.post('/signup',controller.users.post)

app.get('/*',(req,res)=>res.redirect('/'));

app.listen(port,()=> console.log('Listening on :', port));

module.exports.app = app;