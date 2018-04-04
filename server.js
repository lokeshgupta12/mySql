// Get dependencies
const express = require('express');
const path = require('path');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var pool = require('./databaseConnection/databaseConnection')
const bodyParser = require('body-parser');
const session = require('express-session');
var cors = require('cors')

// Get our API routes
const api = require('./server/routes/api');
var sessionVariable = {}
const app = express();
 app.use(cors());
 app.use(session({secret: 'project'}));
// Parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Point static path to dist
app.use(express.static(path.join(__dirname, 'dist')));

// Set our api routes
// app.use('/api', api);

// Catch all other routes and return the index file
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'dist/index.html'));
// });
app.post("/login", function(req, res, next) {
       var sess = req.session
       console.log(req.session)
	pool.getConnection(function(err, connection) {
		if(err) throw err;
		var sql = "SELECT * FROM user where name =?";
       connection.query(sql, [req.body.name],function(error, firstresult) {
       	if(error) throw error;
              // connection.release();
              console.log(firstresult[0].name, "result")
              var token = jwt.sign({ id: firstresult[0].name }, "secret", {
      expiresIn: 600 // expires in 24 hours
    });
               var values = [
                 [new Date(),req.sessionID, req.body.name, token]
               ]
              connection.query("INSERT INTO login_history (login_time, session_id, user_name, auth_token) values ?",[values],function(error, result) {
              if(error) throw error;
              connection.release();
              sess[req.sessionID] = token
               res.send({
                     "status": "ok",
                     "result": firstresult,
                     "auth_token" : token
               })
        })
       	 // res.send({
       	 // 	"status": "ok",
       	 // 	"result": result
       	 // })
       })
	})
})

/**
 * Get port from environment and store in Express.
 */
const port = process.env.PORT || '3000';
app.set('port', port);

/**
 * Create HTTP server.
 */
// const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
app.listen(port, () => console.log(`API running on localhost:${port}`));