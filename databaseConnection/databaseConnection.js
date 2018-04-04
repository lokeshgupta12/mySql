const mysql = require('mysql')
var connection=mysql.createPool({
 connectionLimit : 100,
 host:'localhost',
 user:'root',
 database:'mydb'
 
});
module.exports=connection;