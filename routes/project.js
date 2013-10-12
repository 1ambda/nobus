var pool = require('../library/mysql-pool');
var async = require('async');
var util = require('util');


exports.index = function (req, res) {
    console.log("Route : goProjectPage");
    id = req.session.user_id;

    if (id) {
        res.render('project.html');
    } else {
        res.redirect('/');
    }
};

exports.getProjectName = function (req, res) {
    if (req.session.user_id) {
        if (req.session.project_name) {
            res.send({
                team_name: req.session.project_name,
                team_id: req.session.team_id,
                user_id: req.session.user_id
            });
        }
    } else {
        res.redirect('/');
    }
};

exports.logout = function (req, res) {
    req.session.destroy(function () {
        console.log("Route: Logout");
    });

    res.write("");
    res.end();
};

exports.inviteMemberTypeahead = function (req, res) {

    console.log("Route : inviteMemberTypeahead ");

    if (req.session.user_id) {
        pool.acquire(function (err, conn) {

            console.log(err);

            if (!err) {
                var query = "SELECT id FROM user WHERE UPPER(id) like ?;";

                conn.query(query, [req.query.user_id + '%'], function (err, rows) {
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

exports.dropoutProject = function (req, res) {
    console.log("Route : deleteProject");

    //variable needs : team_id, user_id
    team_id = req.session.team_id;
    user_id = req.session.user_id;

    if (team_id) {
        pool.acquire(function (err, conn) {
            conn.query("UPDATE user_team SET take_on = 0 WHERE team_id=(?) AND user_id=(?);", [team_id, user_id], function (err, rows) {
                pool.release(conn);
                res.render('welcome.html');
            });
        });
    } else {

        res.redirect('/');
    }
};

exports.inviteMemberAction = function (req, res) {
    console.log("Route : inviteMemberAction");

    team_id = req.session.team_id;
    user_id = req.body.user_id;

    var selectQuery = "SELECT * FROM user WHERE id = ?;";
    var checkQuery = "SELECT count(take_on) count FROM user_team WHERE team_id = ? AND user_id = ?;";
    var updateQuery = "UPDATE user_team SET take_on = 1 WHERE team_id=(?) AND user_id=(?);"
    var inputQuery = "INSERT INTO user_team (team_id, user_id) VALUES (? , ?);";

    pool.acquire(function (err, conn) {

        conn.query(selectQuery, [user_id], function (err, rows) {
            if (rows.length === 0) {
                pool.release(conn);
                res.send({
                    status: "not_exist"
                });
            } else {

                conn.query(checkQuery, [team_id, user_id], function (err1, rows1) {
                    console.log(rows1);
                    if (rows1[0].count === 0) {
                        conn.query(inputQuery, [team_id, user_id], function (err2, rows2) {
                            if (err1) {
                                pool.release(conn);
                                console.log("InviteMemberAction Fail : " + err2);
                                res.send({
                                    "status": "fail"
                                });
                            } else {
                                pool.release(conn);
                                console.log("input success");
                                res.send({
                                    "status": "success"
                                });
                            }
                        });

                    } else {
                        conn.query(updateQuery, [team_id, user_id], function (err2, rows2) {
                            if (err1) {
                                pool.release(conn);
                                console.log("InviteMemberAction Fail : " + err2);
                                res.send({
                                    "status": "fail"
                                });
                            } else {
                                pool.release(conn);
                                console.log("update success");
                                res.send({
                                    "status": "success"
                                });
                            }
                        });
                    }
                });
            }
        });
    });

};

exports.getTeamMembers = function (req, res) {
    console.log("Route : getTeamMembers");

    team_id = req.session.team_id;

    var query = "SELECT user_id FROM user_team WHERE team_id = ? AND take_on = 1;";

    pool.acquire(function (err, conn) {
        conn.query(query, [team_id], function (err, rows) {
            pool.release(conn);
            if (!err) {

                res.send({
                    status: "success",
                    data: rows
                });
            } else {
                console.log(err);
                res.send({
                    status: "fail"
                });
            }
        });
    });

};

exports.pushTask = function (req, res) {
    console.log("Route : push");

    console.log(req.body.name);
    team_id = req.session.team_id;
    name = req.body.name;
    user_id = req.body.user_id;
    start_date = req.body.start_date;
    due_date = req.body.due_date;
    var taskQuery = "INSERT INTO task(team_id, name, start_date, due_date) VALUES (?, ?, ?, ?);";
    var getTaskIdQuery = "SELECT id FROM task WHERE team_id = ? AND name = ?;";
    var userTaskQuery = "INSERT INTO user_task(user_id, task_id) /VALUES(?, ?);";

    pool.acquire(function (err, conn) {
        conn.query(taskQuery, [team_id, name, start_date, due_date], function (err, rows) {
            if (err) {
                console.log("this");
                console.log(err);
                console.log("this");
                pool.release(conn);
            } else {
                console.log("1");
                conn.query(getTaskIdQuery, [team_id, name], function (err, rows) {
                    req.session.task_id = rows[0].id;
                    conn.query(userTaskQuery, [user_id, req.session.task_id], function (err, rows) {
                        pool.release(conn);
                        if (err) {
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

exports.getTaskList = function (req, res) {

    user_id = req.session.user_id;
    team_id = req.session.team_id;

    var queryTask = "select id as task_id, name, finished from task where team_id = ?;";

    var taskList = { taskBoxes : [] };

    pool.acquire(function (err, conn) {
        if (err) errorHandler(res, err, conn);
        else {
            conn.query(queryTask, [team_id], function (err, rows) {
                if (err) errorHandler(res, err, conn);
                else {

                    var params = [];
                    var task_kinds = [ 'push', 'toss', 'submit' ];

                    for (var i = 0; i < rows.length; i++) {
                        params[i] = {task_id: rows[i].task_id, index: i };
                        taskList.taskBoxes[i] = (rows[i]);
                    }

                    async.each(params, function (param, callback) {

                        var task_id = param.task_id;
                        var i = param.index;

                        async.each(task_kinds, function (task_kind, callback) {
                            getTaskBox(callback, task_kind, task_id, taskList.taskBoxes[i]);
                        }, function (err) {
                            return callback();
                        });

                    }, function (err) {
                        console.log(util.inspect(taskList, false, null));
                        pool.release(conn);
                        res.send(taskList);
                    });
                }
            });
        }

    });
};

function getTaskBox(callback, task_kind, task_id, taskBox) {

    var queryMap = [];
    queryMap['push'] = "SELECT id, due_date FROM push WHERE task_id = ?;";
    queryMap['toss'] = "SELECT id, due_date FROM toss WHERE task_id = ?;";
    queryMap['submit'] = "SELECT id, submit_date FROM submit WHERE task_id = ?;";

    taskBox["taskElems"] = [];

    pool.acquire(function (err, conn) {
        if (err) errorHandler(null, err, null);
        else {
            conn.query(queryMap[task_kind], [task_id], function (err, rows) {
                if (err) errorHandler(null, err, conn);
                else {

                    taskBox[task_kind] = [];

                    for (var i = 0; i < rows.length; i++) {
                        taskBox[task_kind][i] = rows[i];
                    }

                    console.log(taskBox["taskElems"]);

                    async.each(taskBox[task_kind], function (task_elem, callback) {

                        console.log(task_elem);
                        getElemUser(callback, task_elem, task_kind);

                    }, function (err) {
                        pool.release(conn);
                        return callback();
                    });

                }
            })
        }
    });
};

function getElemUser(callback, task_elem, task_kind) {

    var queryMap = [];
    queryMap['push'] = "SELECT user_id FROM push_user WHERE push_id = ?";
    queryMap['toss'] = "SELECT user_id FROM toss_user WHERE toss_id = ?";
    queryMap['submit'] = "SELECT user_id FROM submit_user WHERE submit_id = ?";

    pool.acquire(function(err, conn) {
        if(err) errorHandler(null, err, null) ;
        else {
            conn.query(queryMap[task_kind], [task_elem['id']], function(err, rows) {
                if(err) errorHandler(null, err, conn);
                else {

                    console.log('working');
                    task_elem.users = rows;
                    task_elem.task_kind = task_kind;

                    pool.release(conn);
                    return callback();
                }
            });
        }
    });
};


function errorHandler(res, err, conn) {
    console.log(err);

    if ( res !== null )
        res.send({status : "fail"});

    if ( conn !== null)
        pool.release(conn);
};


// get /project/comments
exports.getComments = function (req, res) {
    var team_id = req.params.team_id;
    console.log(team_id);

    // query for get comments list from DB

    var data = [];
    data[0] = {
        team_id: "69",
        user_id: "Hoon",
        comment: "Hi, Guys!",
        time: "2013-10-09 12:25"
    };
    data[1] = {
        team_id: "69",
        user_id: "Hoon",
        comment: "Hi, Guys!",
        time: "2013-10-09 12:25"
    };
    data[2] = {
        team_id: "69",
        user_id: "Hoon",
        comment: "Hi, Guys!",
        time: "2013-10-09 12:25"
    };
    data[3] = {
        team_id: "69",
        user_id: "Hoon",
        comment: "Hi, Guys!",
        time: "2013-10-09 12:25"
    };

    res.send(data);
};

exports.test = function (req, res) {

};

exports.upload = function (req, res) {
    fs.readFile(req.files.uploadFile.path, function (error, data) {
        var filePath = ___dirname + "\\files\\" + req.files.uploadFile.name;
        fs.writeFile(filePath, data, function (error) {
            if (error) {
                throw err;
            } else {
                res.redirect(filePath);
            }
        });
    });
};

