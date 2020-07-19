require('dotenv').config();
const createError   = require('http-errors');
const express       = require('express');
const path          = require('path');
const cookieParser  = require('cookie-parser');
const bodyParser    = require('body-parser');
const url           = require('url');
const querystring   = require('querystring');
const observation   = require('./routes/observation');
const indexRouter   = require('./routes/index');
const usersRouter   = require('./routes/users');

var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/',(req, res) => res.send('<h1>operations</h1><p><ul><li>GET /observations</li><li>POST /add_observation</li></ul></p>'))
app.get('/observations', observation.index);
app.post('/add_observation', observation.add_observation);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
