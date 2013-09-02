var generic_pool = require("generic-pool");
var mysql = require("mysql");

var mysql = require('mysql');

var pool = generic_pool.Pool({
    name: 'mysql',
    create: function(callback) {
        var config = {
            host: process.env.IP,
            port: '3306',
            user: "leeeunjae",
            password: "",
            database: "NoBus"
        };
        
        var client = mysql.createConnection(config);
        client.connect(function (error) {
               
        });
    },
    destroy: function(client) {
        
    },
    min: 7,
    max: 10,
    idleTimeoutMillis: 300000,
    log: true
});
