 //database관련
var mysql = require('mysql');
var config = {
    host: '54.250.195.214',
    port: '3306',
    user: "root",
    password: "youth",
    database: "youth"
};

var conn = mysql.createConnection(config);

exports.logout = function(req, res) {
    req.session.destroy(function() {
        console.log("Route: Logout");
    });
    
    res.write("");
    res.end();
};

exports.getTeamList = function(req, res) {
    
    var id = req.session.user_id;
    
    if ( id ) {
        
        // Query for sending team-list
        
        conn.query("SELECT team.team_id, team_name FROM (user JOIN user_team ON user.user_id " +
        "= userteam.user_id) JOIN team ON userteam.Team_id = team.team_id "+
        "WHERE user.user_id = ?;",[id] , function(err, rows){
        res.send(rows);
        });
        
    } else {
        res.send({"status": "err"});
    }  
    
};

exports.getUserID = function(req, res) {
    
    var id = req.session.user_id;
    
    if ( id ) {
        res.write(id);
        res.end();
    } else {
        console.log("Route: getUserID error");
        res.end();
    } 
};