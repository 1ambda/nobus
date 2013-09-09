
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
	if ( req.session.user_id ) {
		if ( req.session.project_name) {
			res.send({"project_name" : req.session.project_name } );
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

