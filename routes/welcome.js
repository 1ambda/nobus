 //database관련
var mysql = require('mysql');
var config = {
    host: process.env.IP,
    port: '3306',
    user: "leeeunjae",
    password: "",
    database: "NoBus"
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
        
        conn.query("SELECT Team.team_id, team_name FROM (User JOIN UserTeam ON User.user_id " +
        "= UserTeam.user_id) JOIN Team ON UserTeam.team_id = Team.team_id "+
        "WHERE User.user_id = ?;",[id] , function(err, rows){
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
}