var async = require('async');
var util = require('util');
var pool = require('../library/mysql-pool');


exports.testAsync = function (req, res) {

    var user_id = 'Hoon';
    var team_id = 69;

    var queryTask = "select id as task_id, name, finished from task where team_id = ?;";

    var taskList = [];

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
                        taskList.push(rows[i]);
                    }

                    async.each(params, function (param, callback) {

                        var task_id = param.task_id;
                        var i = param.index;
//                        getTaskBox(callback, 'push', task_id, taskList[i]);
                        async.each(task_kinds, function (task_kind, callback) {
                            getTaskBox(callback, task_kind, task_id, taskList[i]);
                        }, function (err) {
                            return callback();
                        });

                    }, function (err) {
                        console.log(util.inspect(taskList, false, null));
                        pool.release(conn);
                    });
                }
            });
        }

    });

    res.send();
};

function getTaskBox(callback, task_kind, task_id, taskBox) {

    var queryMap = [];
    queryMap['push'] = "SELECT id, due_date FROM push WHERE task_id = ?;"
    queryMap['toss'] = "SELECT id, due_date FROM toss WHERE task_id = ?;"
    queryMap['submit'] = "SELECT id, submit_date FROM submit WHERE task_id = ?;"

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

                    async.each(taskBox[task_kind], function (task_elem, callback) {

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
                task_elem.users = rows;

                pool.release(conn);
                return callback();
            });
        }
    });
};


function errorHandler(res, err, conn) {
    console.log(err);

    if (res !== null)
        res.send({status: "fail"});

    if (conn !== null)
        pool.release(conn);
};
