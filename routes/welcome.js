var pool = require('../library/mysql-pool');

exports.logout = function(req, res) {
    req.session.destroy(function() {
        console.log("Route: Logout");
    });
    
    res.write("");
    res.end();
};

exports.getTeamList = function(req, res) {
    
    console.log("Route : getTeamList");
    
    var id = req.session.user_id;
    
    if ( id ) {
        
        // Query for sending team-list
        
        pool.acquire(function(err, conn) {
        	
        	var query = "select team.team_name from user_team natural join team where user_team.user_id = ?;";
        
	        conn.query(	query ,[id] , function(err, rows, cols){
		        pool.release(conn);
		        if (err) {
		        	console.log(err);
		        }
		        console.log(rows);
		        res.send(rows);
			});
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

exports.createTeam = function(req, res) {
	
	console.log("Route : createTeam");
	
	id = req.session.user_id;
	
	if (id) {
		pool.acquire(function(err, conn) {
	        conn.query("SELECT max(team_id) as max from Team;", function(err, rows){
	            var num = rows[0].max+1;
	            conn.query("INSERT INTO Team(team_name) VALUES (?);", [name], function(){
	                conn.query("INSERT INTO UserTeam(user_id, team_id) VALUES(?, ?);", [id, num], 
	                function(err, rows2){
	                	pool.release(conn);
						res.send({"status": "success"});
					});
				});
			});
		});
	} else {
		res.redirect('/');
	}
};

exports.selectProject = function(req, res) {
	console.log("Route : selectProject");
	
	id = req.session.user_id;
	
	if (id) {
		res.render('project.html');
	} else {
		res.redirect('/');
	}
};






