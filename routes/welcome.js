var pool = require('../library/mysql-pool');

exports.index = function(req, res) {
    if (req.session.user_id) {
        res.render('welcome');
    } else {
        res.redirect('back');
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

		 var query = "SELECT name " +
		  			 "FROM (user_team B JOIN team C ON team_id=id) JOIN user A on B.user_id = A.id " +
		  			 "WHERE A.user_id = ?;";

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
	name = req.body.team_name;
	if (id) {
		pool.acquire(function(err, conn) {
	        conn.query("SELECT max(id) as max FROM team;", function(err, rows){
	        	var num = rows[0].max + 1;
	        	console.log(err);
	            conn.query("SELECT id FROM user WHERE user_id=?", [id], function(err, rows2){
		            if (!err) {
		            	var ide = rows2[0].id;
			            console.log("ide : "+ide);
			            console.log("num : "+num);
			            conn.query("INSERT INTO team(id, name) VALUES (?, ?);", [num, name], function(err, rows3){
			            	if (!err) {
			            		conn.query("INSERT INTO user_team (user_id, team_id) VALUES (? , ?);", [ide, num], function(err, rows4){
			            			pool.release(conn);
				            	});
								res.send({"status": "success"});
			            	} else {
			            		console.log(err);
			            	}
			            	
						});	
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
		req.session.project_name = req.body.project_name;
		res.send();
	} else {
		res.redirect('/');
	}
};

exports.deleteProject = function(req, res){
	console.log("Route : deleteProject");
	
	id = req.session.user_id;
	name = req.body.name;
	
	if(id){
		pool.acquire(function(err, conn) {
        conn.query("DELETE FROM team WHERE name=(?)",[name], function(err, rows){
            pool.release(conn);
            res.send({"status": "sucess"});
            res.render('project.html');
			});
		});		
	} else {
		res.redirect('/');
	}
	
};

