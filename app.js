
/**
 * Module dependencies.
 */
 


var express = require('express');
var routes = require('./routes');
var welcome = require('./routes/welcome');
var project = require('./routes/project');
var template = require('./routes/template');
var test = require('./routes/test');
var http = require('http');
var path = require('path');
var fs = require('fs');
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
//app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname + '/public'));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}
var server = http.createServer(app);
var io = require('socket.io').listen(server);

server.listen(app.get('port'));

app.get('/', routes.index);
app.post('/register', routes.register);
app.post('/login', routes.login);
app.get('/welcome', welcome.index);
app.get('/welcome/logout', welcome.logout);
app.get('/welcome/getUserID', welcome.getUserID);
app.get('/welcome/getTeamList', welcome.getTeamList);
app.post('/welcome/createTeam', welcome.createTeam);
app.post('/welcome/projectSelected', welcome.projectSelected);
app.post('/welcome/createTeam', welcome.createTeam);
app.get('/project', project.index);
app.get('/project/dropout', project.dropoutProject);
app.get('/project/getProjectName', project.getProjectName);
app.get('/project/inviteMemberTypeahead', project.inviteMemberTypeahead);
app.get('/project/pushMemberTypeahead', project.pushMemberTypeahead);
app.get('/project/getTeamMembers', project.getTeamMembers);
app.post('/project/inviteMemberAction', project.inviteMemberAction);
app.post('/project/pushAction', project.pushAction);
app.get('/project/test', project.test);
app.get('/project/getTaskList', project.getTaskList);

// RESTFUL API
app.get('/project/comments/:team_id', project.getComments);
app.get('/project/push/:id', project.getPush);
app.get('/project/toss/:id', project.getToss);
app.get('/project/submit/:id', project.getSubmit);

// to convert RESTFUL API
app.post('/project/passAction', project.passAction);

// for test

app.get('/test/testAsync', test.testAsync);

// for socket.io
var comment = require('./routes/sockets/comment').listen(io);

// for jQuery Template
app.get('/template/dlgMemberList', template.dlgMemberList);
app.get('/template/dialogTask', template.dialogTask);

app.get('/template/dlgRegister', template.dlgRegister);
app.get('/template/dlgDrop', template.dlgDrop);
app.get('/template/dlgInvite', template.dlgInvite);
app.get('/template/dlgPush', template.dlgPush);
app.get('/template/dlgTask', template.dlgTask);
app.get('/template/dlgPass', template.dlgPass);


//for upload File
// app.get('/project/test', routes.test);

