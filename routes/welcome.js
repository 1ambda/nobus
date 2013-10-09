var pool = require('../library/mysql-pool');

exports.index = function(req, res) {
    if (req.session.user_id) {
        res.render('welcome');
    } else {
        var id = req.body.user_id;
        var pwd = req.body.user_pwd;

        pool.acquire(function(err, conn) {

            // Query
            conn.query("SELECT id count FROM user WHERE id=? and pwd=?", [id, pwd], function(err, rows){
                console.log(rows);
                pool.release(conn);

                if ( rows.length === 0 ) {
                    res.redirect('back');
                } else {
                    res.render('welcome');
                }
            });
        });
    }

};

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

	if (id) {

		// Query for sending team-list

		 pool.acquire(function(err, conn) {

		 var query = "SELECT C.id, C.name " +
		  			 "FROM user_team B JOIN team C ON B.team_id=C.id WHERE B.user_id = ? AND B.take_on = 1;";

		 conn.query(query, [id], function(err, rows, cols) {
		 pool.release(conn);
		 if (err) {
		 console.log(err);
		 }
		 console.log(rows);
		 res.send(rows);
		 });
		 });

	} else {
		res.send({
			"status" : "err"
		});
	}

};

exports.getUserID = function(req, res) {

	var id = req.session.user_id;

	if (id) {
		res.send( { id: id });
	} else {
		console.log("Route: getUserID error");
		res.end();
	}
};

exports.createTeam = function(req, res) {

	console.log("Route : createTeam");

	id = req.session.user_id;
	name = req.body.team_name;
	
	console.log("team_name" + name);
	if (id) {
		pool.acquire(function(err, conn) {
	        conn.query("SELECT max(id) as max FROM team;", function(err, rows){
	        	var num = rows[0].max + 1;
	        	console.log(err);
	        	conn.query("INSERT INTO team(id, name) VALUES (?, ?);", [num, name], function(err, rows3){
	        		if (!err) {
	        			conn.query("INSERT INTO user_team (user_id, team_id) VALUES (? , ?);", [id, num], function(err, rows4){
	        			pool.release(conn);
	        			});
	        			res.send({"status": "success"});
	        		} else {
	        			console.log(err);
	        		}
			            	
	        	});	        
	        });
	            
		});
	} else {
		res.redirect('/');
	}
};

exports.projectSelected = function(req, res) {
	console.log("Route : projectSelected");
	
	id = req.session.user_id;
	
	if (id) {
		req.session.team_id = req.body.team_id;
		req.session.project_name = req.body.project_name;
		res.send();
	} else {
		res.redirect('/');
	}
};

