var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var ejs = require('ejs');
require('dotenv').config()
const userModel = require('./Model/userRegistrationModel'); //Table Schema
const rolesModel = require('./Model/RolesModel');

//middleware
const tokenCheck = require('./authentication');
const adminCheck = require('./adminMiddleware');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var loginRouter = require('./routes/loginRouter');
var rolesRouter = require('./routes/roles')

var app = express();

// Set the views directory location
app.set('views', path.join(__dirname, 'views'));

// Set the view engine to EJS
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Include the AdminLTE CSS and JS files
app.use('/adminlte', express.static(path.join(__dirname, 'node_modules/admin-lte')));

// Define your routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/login', loginRouter);
app.use('/admin',tokenCheck,adminCheck, rolesRouter);


module.exports = app;
