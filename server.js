// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express')
var app      = express()
var mongoose = require('mongoose')
var passport = require('passport')
var flash    = require('connect-flash')

var morgan       = require('morgan')
var cookieParser = require('cookie-parser')
var bodyParser   = require('body-parser')
var session      = require('express-session')

var configDB = require('./config/db.js').mongoDB

// configuration ===============================================================
mongoose.connect(configDB.server) // connect to our database

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log("We're connected to " + configDB.name + "!")
});

require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms

app.set('view engine', 'pug'); // set up pug for templating

// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
require('./app/routes/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
// Port Setup
var port = normalizePort(process.env.PORT || 8080);

app.listen(port, function () {
  console.log('Touch Refs app listening on port! ', port)
})

function normalizePort(val) {
  var port = parseInt(val, 10)

  if (isNaN(port)) {
    // named pipe
    return val
  }

  if (port >= 0) {
    // port number
    return port
  }

  return false
}
