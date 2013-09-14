var pool = require('../library/mysql-pool');

exports.index = function(req, res) {
	console.log("Route : goProjectPage");
	id = req.session.user_id;

	if (id) {
		res.render('project.html');
	} else {
		res.redirect('/');
	}
};

exports.getProjectName = function(req, res) {
	if (req.session.user_id) {
		if (req.session.project_name) {
			res.send({
				"project_name" : req.session.project_name
			});
		}
	} else {
		res.redirect('/');
	}
};

exports.logout = function(req, res) {
	req.session.destroy(function() {
		console.log("Route: Logout");
	});

	res.write("");
	res.end();
};

exports.inviteMemberTypeahead = function(req, res) {

	console.log("Route : inviteMemberTypeahead ");

	if (req.session.user_id) {
		pool.acquire(function(err, conn) {

			console.log(err);

			if (!err) {
				var query = "SELECT id FROM user WHERE UPPER(id) like ?;";

				conn.query(query, [req.query.user_id + '%'], function(err, rows) {
					pool.release(conn);
					console.log(err);

					if (!err) {

						var list = new Array();

						for (var i = 0, l = rows.length; i < l; i++) {
							list[i] = rows[i].id;
						}

						res.send(list);
					}
				});
			}
		});
	} else {
		res.redirect('/');
	}

};

exports.dropoutProject = function(req, res) {
	console.log("Route : deleteProject");

	//variable needs : team_id, user_id
	team_id = req.session.team_id;
	user_id = req.session.user_id;

	if (team_id) {
		pool.acquire(function(err, conn) {
			conn.query("UPDATE user_team SET take_on = 0 WHERE team_id=(?) AND user_id=(?);", [team_id, user_id], function(err, rows) {
				pool.release(conn);
				res.render('welcome.html');
			});
		});
	} else {

		res.redirect('/');
	}
};

exports.inviteMemberAction = function(req, res) {
	console.log("Route : inviteMemberAction");

	team_id = req.session.team_id;
	user_id = req.body.user_id;

	var selectQuery = "SELECT * FROM user WHERE id = ?;";
	var inputQuery = "INSERT INTO user_team (team_id, user_id) VALUES (? , ?);";

	pool.acquire(function(err, conn) {

		conn.query(selectQuery, [user_id], function(err, rows) {
			if (rows.length === 0) {
				pool.release(conn);
				res.send({
					status : "not_exist"
				});
			} else {

				conn.query(inputQuery, [team_id, user_id], function(err, rows) {
					if (err) {
						pool.release(conn);
						console.log("InviteMemberAction Fail : " + err);
						res.send({
							"status" : "fail"
						});
					} else {
						pool.release(conn);
						console.log("invite success");
						res.send({
							"status" : "success"
						});
					}
				});
			}
		});
	});

};

exports.getTeamMembers = function(req, res) {
	console.log("Route : getTeamMembers");

	team_id = req.session.team_id;
	var query = "SELECT user_id FROM user_team WHERE team_id = ? AND take_on = 1;";

	pool.acquire(function(err, conn) {
		conn.query(query, [team_id], function(err, rows) {
			pool.release(conn);
			if (!err) {
				res.send({
					status : "success",
					data : rows
				});
			} else {
				console.log(err);
				res.send({
					status : "fail"
				});
			}
		});
	});

};

exports.test = function(req, res) {

}; 