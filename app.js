if(process.env.NODE_ENV === 'development') {
    require("dotenv").config();
}

const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressHb = require('express-handlebars')
const expressValidator = require('express-validator');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const flash = require('connect-flash');

const index = require('./routes/index');
const users = require('./routes/users');
const tests = require('./routes/tests');
const games = require('./routes/games');

const app = express();
app.io = require('./sockets');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', expressHb({defaultLayout: 'auth_layout.handlebars'}));
app.set('view engine', 'handlebars');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/:any', express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: 'secret',
    name: 'secret_name',
    saveUninitialized: true,
    resave: true
}));
app.use(passport.initialize());
app.use(passport.session({
    secret: 'secret',
    name: 'secret_name',
    proxy: true,
    resave: true,
    saveUninitialized: true
}));

app.use(expressValidator({
    errorFormatter: (param, msg, value) => {
        const namespace = param.split('.')
            , root = namespace.shift()
            , formParam = root;

        while(namespace.length){
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));

app.use(flash())
app.use((req, res, next) =>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

app.use('/', index);
app.use('/users', users);
app.use('/tests', tests);
app.use('/games', games);

// catch 404 and forward to error handler
app.use((req, res, next) =>{
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// error handler
app.use((err, req, res, next) =>{
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
