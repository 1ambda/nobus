
/*
 * GET home page.
 */
 

var fs = require("fs");

 //database관련
var mysql = require('mysql');
var config = {
    host: process.env.IP,
    port: '3306',
    user: "leeeunjae",
    password: "",
    database: "NoBus"
};
var conn = mysql.createConnection(config);


exports.index = function(req, res){
    if (req.session.user_id) {
        console.log(req.session.user_id);
        res.render('welcome');
    } else {
        res.render('index');
    }
};

exports.register = function(req,res) {
    
    console.log("register");
    
    var id = req.body.user_id;
    var id = req.body.user_pwd;
    
    // Query
    conn.query("SELECT count(user_id) as count FROM User WHERE user_id=? and user_pwd=?", [id, pwd], function(err, rows){
        if ( rows[0].count == "0" ) {
            conn.query("INSERT INTO User(user_id, user_pwd) VALUES (?,?)", [id, pwd], function(){      	 
            });
            res.send({ "status": "Registerd" });
        } else {
            res.send({ "status": "Already Registered"});
        }
    });
};

exports.login = function(req, res) {
    
    console.log("Hello");
    
    var id = req.body.user_id;
    var pwd = req.body.user_pwd;
    
    // Query
    conn.query("SELECT count(user_id) as count FROM User WHERE user_id=? and user_pwd=?", [id, pwd], function(err, rows){

        if ( rows[0].count == "0" ) {
            res.send({ "status": "FAIL"});
        } else {
            req.session.user_id = id;
            res.send({ "status": "SUCCESS" });
        }
    });
};

exports.welcome = function(req, res) {
    if (req.session.user_id) {
        res.render('welcome');
    } else {
        res.redirect('back');
    }
};