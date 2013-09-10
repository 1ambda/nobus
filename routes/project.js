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

				conn.query(query, [ req.query.user_id + '%'], function(err, rows) {
					pool.release(conn);
					console.log(err);
					
					if (!err) {
						
						var list = new Array();
						
						for(var i = 0, l = rows.length; i < l; i ++) {
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

