const mysql = require("mysql")
var tableArray = require("./tableSchemaQuery/queryForNewTable")
var con = mysql.createConnection({
	host: "localhost",
	user: "root"
});
con.connect(function(err) {
	if(err) throw err;
	console.log("connected")
	con.query("CREATE DATABASE IF NOT EXISTS mydb", function(err, result) {
		if(err) throw err;
		 con.query('USE mydb', function (err) {
        if (err) throw err;
        for(var i in tableArray) {
        	con.query(tableArray[i], function (err) {
                if (err) throw err;
            });
        }
        
    });
	})
});