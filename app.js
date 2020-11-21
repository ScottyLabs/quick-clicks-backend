var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
const Site = require('./server/schemaOutline');
const { StringDecoder } = require('string_decoder');
const dotenv = require("dotenv");
dotenv.config();

var app = express();

//Mongoose stuff?
const dbURL = process.env["MONGODB_URL"];
mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true})
  .then((result) => console.log('connected to db'))
  .catch((err) => console.log(err));
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

//post function
app.post('/create-site', function(req, res) {
  const site = new Site(req.body);
  site.save() 
    .then((result) => {
        //what we do after saving? Do nothing?
    })
    .catch((err) => {
      console.log(err);
    })
})

//to test queries in Compass: everything inside the brackets: from "category" to "}"
app.get('/database-all', function(req, res) {
  Site.find({category: {
    $in: ["food"]
  }}, (function (err, site) {
    return res.json(site)
  }))
})





// -----DON'T WORRY ABOUT IT----- // 
// view engine setup
app.set('views', path.join(__dirname, 'views_new'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


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


app.listen(5000);

module.exports = app;
