
var pool = require('../library/mysql-pool');

exports.getProjectName = function(req, res) {
	if ( req.session.user_id ) {
		if ( req.session.project_name) {
			res.send({"project_name" : req.session.project_name } );
		}
	} else {
		res.redirect('/');
	}
};
