
/*
 * GET home page.
 */

var pool = require('../library/mysql-pool'); 

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
    var pwd = req.body.user_pwd;

	pool.acquire(function(err, conn) {
	    // Query
	    conn.query("SELECT id FROM user WHERE id=? and pwd=?", [id, pwd], function(err, rows){
	    	console.log(rows[0].id);
	    	
	        if ( rows.length === 0  ) {
	    		pool.release(conn);
	            conn.query("INSERT INTO user(id, pwd) VALUES (?,?)", [id, pwd], function(){      	 
	            });
	            res.send({ "status": "Registerd" });
	        } else {
	    		pool.release(conn);
	            res.send({ "status": "Already Registered"});
	        }

	    });
	});
};

exports.login = function(req, res) {
    
    console.log("Hello");
    
    var id = req.body.user_id;
    var pwd = req.body.user_pwd;
    
    pool.acquire(function(err, conn) {
    	
	    // Query
	    conn.query("SELECT id count FROM user WHERE id=? and pwd=?", [id, pwd], function(err, rows){
	    	console.log(rows);
	    	pool.release(conn);
	
	        if ( rows.length === 0 ) {
	        	
	            res.send({ "status": "FAIL"});
	        } else {
	            req.session.user_id = id;
	            res.send({ "status": "SUCCESS" });
	        }
	    });
    });
};


