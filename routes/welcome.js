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

	if (id) {

		// Query for sending team-list

		 pool.acquire(function(err, conn) {

		 var query = "select team.name from user_team join team on user_team.team_id = team.id join user on user.user_id = ?;";

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

	if (id) {

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
