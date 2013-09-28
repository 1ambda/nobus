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
	var checkQuery = "SELECT count(take_on) count FROM user_team WHERE team_id = ? AND user_id = ?;";
	var updateQuery = "UPDATE user_team SET take_on = 1 WHERE team_id=(?) AND user_id=(?);"
	var inputQuery = "INSERT INTO user_team (team_id, user_id) VALUES (? , ?);";

	pool.acquire(function(err, conn) {

		conn.query(selectQuery, [user_id], function(err, rows) {
			if (rows.length === 0) {
				pool.release(conn);
				res.send({
					status : "not_exist"
				});
			} else {

				conn.query(checkQuery, [team_id, user_id], function(err1, rows1) {
					console.log(rows1);
					if (rows1[0].count === 0) {
						conn.query(inputQuery, [team_id, user_id], function(err2, rows2){
							if(err1){
								pool.release(conn);
								console.log("InviteMemberAction Fail : " + err2);
								res.send({
									"status" : "fail"
								});
							} else {
								pool.release(conn);
								console.log("input success");
								res.send({
									"status" : "success"
								});
							}
						});
						
					} else {
						conn.query(updateQuery, [team_id, user_id], function(err2, rows2){
							if(err1){
								pool.release(conn);
								console.log("InviteMemberAction Fail : " + err2);
								res.send({
									"status" : "fail"
								});
							} else {
								pool.release(conn);
								console.log("update success");
								res.send({
									"status" : "success"
								});
							}
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
				console.log(rows);
				
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


exports.pushTask = function(req, res){
	console.log("Route : push");

	team_id = req.session.team_id;
	name = req.body.name;
	user_id = req.body.user_id;
	start_date = req.body.start_date;
	due_date = req.body.due_date;
	var taskQuery = "INSERT INTO task(team_id, name, start_date, due_date) VALUES (?, ?, ?, ?);";
	var getTaskIdQuery = "SELECT id FROM task WHERE team_id = ? AND name = ?;";
	var userTaskQuery = "INSERT INTO user_task(user_id, task_id) VALUES(?, ?);";
	
	pool.acquire(function(err, conn){
		conn.query(taskQuery, [team_id, name, start_date, due_date], function(err, rows){
			if(err){
				console.log(err);
			} else {
				conn.query(getTaskIdQuery, [team_id, name], function(err, rows){
					req.session.task_id = rows[0].id;
					conn.query(userTaskQuery, [user_id, req.session.task_id], function(err, rows){
						pool.release(conn);
						if(err){
							console.log(err);
						} else {
							console.log("success");
						}
					});
				});
			}	
		});
	});
};

exports.getTaskList = function(req, res){
	console.log("Route : getTaskName");
	
	team_id = req.session.team_id;
	user_id = req.body.user_id;
	var query = "SELECT B.user_id, A.id, A.name FROM task A JOIN user_task B ON A.id = B.task_id WHERE B.team_id = ? AND B.task_on = 1;";
	
	pool.acquire(function(req, res){
		conn.query(query, [team_id], function(err, rows){
			pool.release(conn);
			
			if(err){
				console.log(err);
				res.send({"status": "fail"});
			} else {				
				while(i < rows.length){	
					var i = 0;
					var jsonObj = [];
								
					while(i < rows.length){	
						if(user_id == rows[i].user_id){
							jsonObj.push({ allocated: "my", task_name: rows[i].name});
						} else {
							jsonObj.push({ allocated: "other", task_name: rows[i].name});
						}
						
						console.log(jsonObj[i]);
						i++;
					}
					res.send(jsonObj);
				}
			}
		});
	});
};

exports.test = function(req, res) {

};

