var pool = require('../library/mysql-pool');
var async = require('async');
var util = require('util');

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
				team_name : req.session.project_name,
				team_id : req.session.team_id,
				user_id : req.session.user_id
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

    if (req.session.user_id) {

        pool.acquire(function(err, conn) {
            if(err)
                errorHandler(res, err, conn);
            else {
                var query = "SELECT id FROM user WHERE UPPER(id) LIKE ? AND id NOT IN " +
                    "(SELECT user_id FROM user_team WHERE team_id = ?);";

                conn.query(query, [req.query.user_id + '%', req.session.team_id], function(err, rows) {
                    if(err)
                        errorHandler(res, err, conn);
                    else {
                        pool.release(conn);

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

exports.taskMemberTypeahead = function(req, res) {
    if (req.session.user_id) {

        pool.acquire(function(err, conn) {
            if(err)
                errorHandler(res, err, conn);
            else {
                var query = "SELECT id FROM user WHERE UPPER(id) LIKE ? AND id IN " +
                    "(SELECT user_id FROM user_team WHERE team_id = ?);";

                conn.query(query, [req.query.user_id + '%', req.session.team_id], function(err, rows) {
                    if(err)
                        errorHandler(res, err, conn);
                    else {
                        pool.release(conn);

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
						conn.query(inputQuery, [team_id, user_id], function(err2, rows2) {
							if (err1) {
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
						conn.query(updateQuery, [team_id, user_id], function(err2, rows2) {
							if (err1) {
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

exports.pushAction = function(req, res) {
	console.log("Route : push");

    if( req.session.user_id) {
        var user_id = req.session.user_id;
        var team_id = req.session.team_id;
        var due_date = req.body.due_date;
        var title = req.body.title;
        var desc = req.body.desc;
        var members = req.body.members;
        var taskQuery = "INSERT INTO task(team_id, name) VALUES(?,?);";
        var userQuery = "INSERT INTO push(task_id, title, description, due_date) VALUES (?, ?, ?, ?);";
        var upQuery = "INSERT INTO push_user(push_id, user_id) VALUES (?, ?);";
        var idQuery = "SELECT max(id) as max FROM push;";
        var tidQuery = "SELECT max(id) as max FROM task;";
        var push_id;
        var task_id;

        console.log('due_date : ' + due_date);
        console.log(team_id);
        console.log(members);
        
        pool.acquire(function(err, conn){
        	conn.query(taskQuery, [team_id, title], function(tErr, tRows){
        		pool.release(conn);
        		conn.query(tidQuery, function(tidErr, tidRows){
        			pool.release(conn);
        			task_id = tidRows[0].max;
        			conn.query(userQuery, [task_id, title, desc, due_date], function(err, rows){
        				console.log(err);
        				pool.release(conn);
        				conn.query(idQuery, function(idErr, idRows){
        					console.log(idErr);
        					pool.release(conn);
        					push_id = idRows[0].max;
        					for (var i = 0; i < members.length; i++) {
    							conn.query(upQuery, [push_id, members[i]], function(upErr2){
    								console.log(upErr2);
    								pool.release(conn);
    							});
    						}
    			        	res.send({status: "success", task_id: task_id});
        				});
        			});
        		});
        	});
        	res.send({status:"fail"});
        });

    } else {
        res.redirect('/');
    }
};

exports.passAction = function(req, res) {
    console.log("Route : pass");

    if( req.session.user_id) {
        var user_id = req.session.user_id;
        var team_id = req.session.team_id;
        var due_date = req.body.due_date;
        var title = req.body.title;
        var desc = req.body.desc;
        var members = req.body.members;

        console.log('due_date : ' + due_date);

        for (var i = 0; i < members.length; i++) {
            console.log(members[i]);
        };

        res.send();
    } else {
        res.redirect('/');
    }
};

exports.getTaskList = function(req, res) {

	var user_id = req.session.user_id;
	var team_id = req.session.team_id;

	var queryTask = "select id as task_id, name, finished from task where team_id = ?;";

	var taskList = {
		taskBoxes : []
	};

	pool.acquire(function(err, conn) {
		if (err)
			errorHandler(res, err, conn);
		else {
			conn.query(queryTask, [team_id], function(err, rows) {
				if (err)
					errorHandler(res, err, conn);
				else {
					pool.release(conn);

					var params = [];
					var task_kinds = ['push', 'toss', 'submit'];

					for (var i = 0; i < rows.length; i++) {
						params[i] = {
							task_id : rows[i].task_id,
							index : i
						};
						taskList.taskBoxes[i] = rows[i];
						taskList.taskBoxes[i].taskElems = [];
					}
					
					async.each(params, function(param, callback) {

						var task_id = param.task_id;
						var i = param.index;

						async.eachSeries(task_kinds, function(task_kind, callback) {

							getTaskBox(callback, task_kind, task_id, taskList.taskBoxes[i]);
						}, function(err) {
							if(err) console.log(err);
							return callback();
						});

					}, function(err) {
						if(err) console.log(err);
						console.log(util.inspect(taskList, false, null));
						res.send(taskList);
					});
				}
			});
		}
	});
};

function getTaskBox(callback, task_kind, task_id, taskBox) {

	var queryMap = [];
	queryMap['push'] = "SELECT id, DATE_FORMAT(due_date, '%Y-%m-%d') AS due_date FROM push WHERE task_id = ?;";
	queryMap['toss'] = "SELECT id, DATE_FORMAT(due_date, '%Y-%m-%d') AS due_date FROM toss WHERE task_id = ?;";
	queryMap['submit'] = "SELECT id, DATE_FORMAT(due_date, '%Y-%m-%d') AS due_date FROM submit WHERE task_id = ?;";

	pool.acquire(function(err, conn) {
		if (err)
			errorHandler(null, err, null);
		else {
			conn.query(queryMap[task_kind], [task_id], function(err, rows) {
				if (err)
					errorHandler(null, err, conn);
				else {
					pool.release(conn);
					
					taskBox.task_id = task_id;
					
					for(var i = 0; i < rows.length; i++) {
						taskBox.taskElems.push({ task_kind : task_kind, id : rows[i].id, due_date : rows[i].due_date });
					}
					
					
					async.each(taskBox.taskElems, function(task_elem, callback) {
						
						getElemUser(callback, task_elem);

					}, function(err) {
						if(err) console.log(err);
						return callback();
					});

				}
			});
		}
	});
};

function getElemUser(callback, task_elem) {

	var task_kind = task_elem.task_kind;

	var queryMap = [];
	queryMap['push'] = "SELECT user_id FROM push_user WHERE push_id = ?";
	queryMap['toss'] = "SELECT user_id FROM toss_user WHERE toss_id = ?";
	queryMap['submit'] = "SELECT user_id FROM submit_user WHERE submit_id = ?";

	pool.acquire(function(err, conn) {
		if (err)
			errorHandler(null, err, null);
		else {
			conn.query(queryMap[task_kind], [task_elem['id']], function(err, rows) {
				if (err)
					errorHandler(null, err, conn);
				else {

					task_elem.users = rows;

					pool.release(conn);
					return callback();
				}
			});
		}
	});
};

function errorHandler(res, err, conn) {
	console.log(err);

	if (res !== null)
		res.send({
			status : "fail"
		});

	if (conn !== null)
		pool.release(conn);
};

// get /project/comments
exports.getComments = function(req, res) {


    // Sample Data
    var data = {};
    data["title"] = "Sample title";
    data["desc"] = "This is description for the task element";
    data["due_date"] = "2013-11-15";
    data["comments"] = [];
    data["comments"].push({
        user_id : "Hoon",
        comment : "This is a sample comment",
        time : "2013-11-12 23:11"
    });
    data["comments"].push({
        user_id : "Hoon",
        comment : "This is a sample comment",
        time : "2013-11-12 23:11"
    });

    console.log(data);
    res.send(data);

 //    var id = req.params.id;
//    var kind = req.params.kind;
//    var querymap = [];
//    querymap['push'] = "SELECT user_id, txt, DATE_FORMAT(write_time, '%Y-%m-%d %H:%i') AS write_time FROM push_comment WHERE push_id = ?;";
//    querymap['toss'] = "SELECT user_id, txt, DATE_FORMAT(write_time, '%Y-%m-%d %H:%i') AS write_time FROM toss_comment WHERE toss_id = ?;";
//    querymap['submit'] = "SELECT user_id, txt, DATE_FORMAT(write_time, '%Y-%m-%d %H:%i') AS write_time FROM submit_comment WHERE submit_id = ?;";
//    var i;
//    var jsonObj = [];
//
//    console.log("id : " + id);
//    console.log("kind : " + kind);
//
//    pool.acquire(function(err, conn){
//    	if(err){
//    		console.log(err);
//    	} else {
//    		conn.query(querymap[kind], [id], function(err, rows){
//    			pool.release(conn);
//    			if(err){
//    				console.log(err);
//    			} else {
//    				for(i = 0; i < rows.length; i++){
//    					jsonObj.push({user_id: rows[i].user_id, write_time: write_time, desc: txt});
//    				}
//    				console.log(jsonObj);
//    				res.send(jsonObj);
//    			}
//    		});
//    	}
//    });   res.send(data);
};

exports.postComment = function(req, res) {

    var time = req.body.time;
    var name = req.body.name;
    var text = req.body.text;
    var kind = req.body.kind;
    var id = req.body.id;
    var querymap = [];
    querymap['push'] = "INSERT INTO push_comment(push_id, user_id, write_time, txt) VALUES (?,?,?,?);";
    querymap['toss'] = "INSERT INTO toss_comment(toss_id, user_id, write_time, txt) VALUES (?,?,?,?);";
    querymap['submit'] = "INSERT INTO submit_comment(submit_id, user_id, write_time, txt) VALUES (?,?,?,?);";
    var success = [];

    console.log('time : ' + time);
    console.log('name : ' + name);
    console.log('text : ' + text);
    console.log('kind : ' + kind);
    console.log('id : ' + id);
    
	pool.acquire(function(err, conn){
		conn.query(querymap[kind], [id, name, time, text], function(err, rows){
			if(err){
				console.log(err);
			} else {
				success = {push_id: id, user_id: name, write_time: time, desc: text};
				console.log(success);
				res.send(success);
			}
		});
	});
};



exports.getPush = function(req, res) {
    var id = req.params.id;
    var getQuery = "SELECT title, description, DATE_FORMAT(due_date, '%Y-%m-%d') AS due_date FROM push WHERE id = ?;";
    var commentQuery = "SELECT user_id, txt, DATE_FORMAT(write_time, '%Y-%m-%d %H:%i') AS write_time FROM push_comment WHERE push_id = ?;";
    var i;
    var comment = [];

    pool.acquire(function(err, conn){
    	conn.query(getQuery, [id], function(err, rows){
    		pool.release(conn);
    		conn.query(commentQuery, [id], function(cErr, cRows){
    			pool.release(conn);
    			for(i = 0; i < cRows.length; i++){
    				comment.push({user_id: cRows[i].user_id, desc: cRows[i].txt, write_time: cRows[i].write_time});
    			}
    			res.send({title: rows[0].title, desc: rows[0].description, due_date: rows[0].due_date, comment: comment});
    			console.log({title: rows[0].title, desc: rows[0].description, due_date: rows[0].due_date, comment: comment});
    		});
    	});
    });
};

exports.getToss = function(req, res) {
    var id = req.params.id;
    var getQuery = "SELECT title, description, DATE_FORMAT(due_date, '%Y-%m-%d') AS due_date FROM toss WHERE id = ?;";
    var commentQuery = "SELECT user_id, txt, DATE_FORMAT(write_time, '%Y-%m-%d %H:%i') AS write_time FROM toss_comment WHERE push_id = ?;";
    var i;
    var comment = [];

    pool.acquire(function(err, conn){
    	conn.query(getQuery, [id], function(err, rows){
    		pool.release(conn);
    		conn.query(commentQuery, [id], function(cErr, cRows){
    			pool.release(conn);
    			for(i = 0; i < cRows.length; i++){
    				comment.push({user_id: cRows[i].user_id, desc: cRows[i].txt, write_time: cRows[i].write_time});
    			}
    			res.send({title: rows[0].title, desc: rows[0].description, due_date: rows[0].due_date, comment: comment});
    		});
    	});
    });
};
exports.getSubmit= function(req, res) {
    var id = req.params.id;
    var getQuery = "SELECT title, description, DATE_FORMAT(due_date, '%Y-%m-%d') AS due_date FROM submit WHERE id = ?;";
    var commentQuery = "SELECT user_id, txt, DATE_FORMAT(write_time, '%Y-%m-%d %H:%i') AS write_time FROM submit_comment WHERE push_id = ?;";
    var i;
    var comment = [];

    pool.acquire(function(err, conn){
    	conn.query(getQuery, [id], function(err, rows){
    		pool.release(conn);
    		conn.query(commentQuery, [id], function(cErr, cRows){
    			pool.release(conn);
    			for(i = 0; i < cRows.length; i++){
    				comment.push({user_id: cRows[i].user_id, desc: cRows[i].txt, write_time: cRows[i].write_time});
    			}
    			res.send({title: rows[0].title, desc: rows[0].description, due_date: rows[0].due_date, comment: comment});
    		});
    	});
    });
};

exports.postToss = function(req, res) {
    var task_id = req.params.task_id ;
    console.log('postToss');
    console.log('task_id : ' + task_id);
    
    var user_id = req.session.user_id;
    var team_id = req.session.team_id;
    var due_date = req.body.due_date;
    var title = req.body.title;
    var desc = req.body.desc;
    var members = req.body.members;
    var userQuery = "INSERT INTO toss(task_id, title, description, due_date) VALUES (?, ?, ?, ?);";
    var upQuery = "INSERT INTO toss_user(toss_id, user_id) VALUES (?, ?);";
    var idQuery = "SELECT max(id) as max FROM toss;";
    var toss_id;

    console.log('due_date : ' + due_date);
    console.log(team_id);
    console.log(members);
    if( req.session.user_id) {
    	pool.acquire(function(err, conn){
    		conn.query(userQuery, [task_id, title, desc, due_date], function(err, rows){
    			console.log(err);
    			pool.release(conn);
    			conn.query(idQuery, function(idErr, idRows){
    				console.log(idErr);
    				pool.release(conn);
    				toss_id = idRows[0].max;
    				for (var i = 0; i < members.length; i++) {
						conn.query(upQuery, [toss_id, members[i]], function(upErr2){
							console.log(upErr2);
							pool.release(conn);
						});
					}
    				res.send({status: "success", task_id: task_id});
    			});
    		});
    		res.send({status:"fail"});
    	});
    	
	} else {
		res.redirect('/');
	}

};

exports.postSubmit = function(req, res) {
    var task_id = req.params.task_id ;
    console.log('postSubmit');
    console.log('task_id : ' + task_id);
    var user_id = req.session.user_id;
    var team_id = req.session.team_id;
    var due_date = req.body.due_date;
    var title = req.body.title;
    var desc = req.body.desc;
    var members = req.body.members;
    var userQuery = "INSERT INTO submit(task_id, title, description, due_date) VALUES (?, ?, ?, ?);";
    var upQuery = "INSERT INTO submit_user(submit_id, user_id) VALUES (?, ?);";
    var idQuery = "SELECT max(id) as max FROM submit;";
    var finishQuery = "UPDATE task set finished = 1 where id = ?;";
    var submit_id;

    console.log('due_date : ' + due_date);
    console.log(team_id);
    console.log(members);
    if( req.session.user_id) {
    	pool.acquire(function(err, conn){
    		conn.query(finishQuery, [task_id], function(fErr){
    			console.log(fErr);
    			pool.release(conn);
    			conn.query(userQuery, [task_id, title, desc, due_date], function(err, rows){
    				console.log(err);
    				pool.release(conn);
    				conn.query(idQuery, function(idErr, idRows){
    					console.log(idErr);
    					pool.release(conn);
    					submit_id = idRows[0].max;
    					for (var i = 0; i < members.length; i++) {
    						conn.query(upQuery, [submit_id, members[i]], function(upErr2){
    							console.log(upErr2);
    							pool.release(conn);
    						});
    					}
    					res.send({status: "success", task_id: task_id});
    					console.log(task_id);
    				});
    			});
    			res.send({status:"fail"});
    		});
    	});
   	} else {
		res.redirect('/');
	}

};

exports.test = function(req, res) {

};


