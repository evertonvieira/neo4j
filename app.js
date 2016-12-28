var express        = require('express'),
  path             = require('path'),
  favicon          = require('static-favicon'),
  logger           = require('morgan'),
  cookieParser     = require('cookie-parser'),
  bodyParser       = require('body-parser'),
  load             = require('express-load');

var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

load('models').then('controllers').then('routes').into(app);

app.listen(3000, function() {
	console.log('Servidro rodando na porta 3000');
});