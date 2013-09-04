
/**
 * Module dependencies.
 */
 


var express = require('express');
var routes = require('./routes');
var welcome = require('./routes/welcome');
var http = require('http');
var path = require('path');
// var consolidate = require("consolidate");


var app = express();



// all environments
app.set('port', process.env.PORT || 3000);

app.engine('.html', require('ejs').__express);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session( { secret: "Youth" } ));
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}
var server = app.listen(app.get('port'));

app.get('/', routes.index);
app.post('/register', routes.register);
app.post('/login', routes.login);
app.get('/welcome', routes.welcome);
app.get('/welcome/logout', welcome.logout);
app.get('/welcome/getUserID', welcome.getUserID);
<<<<<<< HEAD
app.get('/welcome/getTeamList', welcome.getTeamList);
app.get('/welcome/createTeamList', welcome.createTeam);

=======
app.get('/welcome/selectProject', welcome.selectProject);
>>>>>>> 9d8354878d7025ceb510f70d8e3de4c0cd1c010c


