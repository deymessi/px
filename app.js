var express = require('express');
var http = require('http');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var  mid=require('./servicios/middleware.js');

var routes = require('./routes');
var users = require('./routes/user');

var app = express();


http.createServer(app).listen(process.env.PORT || 8080)
// view engine setup
app.configure(function(){
    app.use(express.bodyParser());
    app.use(express.methodOverride());
});
//configuracion de las vistas
app.set('views', path.join(__dirname, 'views'));
app.engine("html", require("ejs").renderFile);
app.set('view engine', 'html');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);


var mongoose = require('mongoose');
mongoose.connect('mongodb://deyber:deyber@ds047782.mongolab.com:47782/challenge', function(error){
       if(error){
          throw error; 
       }else{
          console.log('conexion en mongo!! realizado ');
       }
    });

require('./routes/routuser.js')(app);
require('./routes/admin/routadmin.js')(app);
//app.get('/', routes.index);
//app.get('/users', users.list);

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
