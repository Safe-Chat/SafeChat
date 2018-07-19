var express = require('express');
var morgan = require('morgan');
var parser = require('body-parser');
var cors = require('cors');
var session = require('express-session')

var controller = require('./controllers');

var app = express();
let port = process.env.PORT || 4000;

app.set('port',port);
app.use(parser.json());
app.use(parser.urlencoded({ extended: false }));
app.use(cors());
app.use(morgan('dev'));
app.use(session({ secret: 'safe-chat-secret', cookie: { maxAge: 60000 }}))

app.use(express.static(__dirname + '/../client/dist'));

// app.get('/users');
// app.post('/users');

app.get('/rooms', isAuth, controller.rooms.get);
app.post('/rooms');

app.get('/messages', isAuth, controller.messages.get);
app.post('/messages', isAuth, controller.messages.post);


/*****************************************************************/
//Authentication Handlers

app.post('/login', controller.users.get)
app.post('/special',controller.users.special)
app.post('/signup', controller.users.post)
app.get('/logout', function(req,res){
  delete req.session.userData
  res.redirect('/')
})
app.get('/auth', isAuth, function(req,res){
  res.send(req.session.userData)
})

function isAuth(req, res, next) {
  if(req.session.userData) next();
  else res.redirect('/');
}
/*****************************************************************/

app.get('/*',(req,res)=>res.redirect('/'));

app.listen(port,()=> console.log('Listening on :', port));

module.exports.app = app;