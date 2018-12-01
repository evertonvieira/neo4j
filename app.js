const express      = require('express'),
  path             = require('path'),
  favicon          = require('static-favicon'),
  logger           = require('morgan'),
  cookieParser     = require('cookie-parser'),
  bodyParser       = require('body-parser'),
  load             = require('express-load'),
  flash            = require('express-flash'),
  session          = require('express-session'),
  env              = require('dotenv').load({path: "./config/config.env"});

var app = express();
var sessionStore = new session.MemoryStore;


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

// initialise session middleware - flash-express depends on it
app.use(session({
  secret : "bd2",
  resave: false,
  saveUninitialized: true
}));

// initialise the flash middleware
app.use(flash());

app.use(function(req, res, next){
  // if there's a flash message in the session request, make it available in the response, then delete it
  res.locals.sessionFlash = req.session.sessionFlash;
  delete req.session.sessionFlash;
  next();
});

app.use('/public', express.static(__dirname + '/public'));

load('models').then('controllers').then('routes').into(app);

app.listen(3000, function() {
	console.log('Servidor rodando na porta 3000');
});