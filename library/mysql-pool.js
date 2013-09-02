var generic_pool = require("generic-pool");
var mysql = require('mysql');

var pool = generic_pool.Pool({
    name: 'mysql',
    create: function(callback) {
		var config = {
		    host: '54.250.195.214',
		    port: '3306',
		    user: "root",
		    password: "youth",
		    database: "youth"
		};
        
        var client = mysql.createConnection(config);
        client.connect(function (error) {
        	if (error) {
        		console.log("Err" + error);
        	}
              
            callback(error, client);
        });
    },
    destroy: function(client) {
        
    },
    min: 7,
    max: 10,
    idleTimeoutMillis: 300000,
    log: true
});

process.on('exit', function() {
	pool.drain(function() {
		pool.destroyAllNow();
	});
});

module.exports = pool;












