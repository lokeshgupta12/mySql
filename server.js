// Get dependencies
const express = require('express');
const path = require('path');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var pool = require('./databaseConnection/databaseConnection')
const bodyParser = require('body-parser');
const session = require('express-session');
var cors = require('cors')
var sess;

// Get our API routes
const api = require('./server/routes/api');
const app = express();
 app.use(cors());
 app.use(session({secret: 'project'}));
// Parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Point static path to dist
app.use(express.static(path.join(__dirname, 'dist')));
app.use(function(req, res, next) {

  if(!sess || req.url == '/login') {
     if(req.url == '/login') {
        next()
     } else {
       res.send ({
        status: "fail",
        message: "Please Login"
       })
     }
  } else {
    jwt.verify(req.headers.token, 'secret', function(err, decoded) {
  if (err) {
    console.log(err, "err")
    delete sess.userId
              delete sess.authToken
              delete sess.name
    /*
      err = {
        name: 'JsonWebTokenError',
        message: 'jwt malformed'
      }
    */
    res.send ({
        status: "fail",
        message: err.message
       })
  } else {

    console.log(decoded, "decode")
    next()
  }
});
  }
  
})
// Set our api routes
// app.use('/api', api);

// Catch all other routes and return the index file
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'dist/index.html'));
// });
app.post("/login", function(req, res, next) {
       sess = req.session
       
	pool.getConnection(function(err, connection) {
		if(err) throw err;
		var sql = "SELECT * FROM user where name =?";
       connection.query(sql, [req.body.name],function(error, firstresult) {
       	if(error) throw error;
            var token = jwt.sign({ id: firstresult[0].id }, "secret", {expiresIn: 600 });
              var values = [[new Date(), req.body.name, token]]
              connection.query("INSERT INTO login_history (login_time, user_name, auth_token) values ?",[values],function(error, result) {
              if(error) throw error;
              if(firstresult[0].user_type == 1) {
                var query = "SELECT * FROM controller"
              } else {
                var query = "SELECT * FROM controller where user_id =" + firstresult[0].id;
              }
              connection.query(query,function(error, secondresult) {
              if(error) throw error;
              connection.release();
              sess.userId = firstresult[0].id
              sess.authToken = token
              sess.name = firstresult[0].name
               res.send({
                     "status": "ok",
                     "result": firstresult,
                     "auth_token" : token,
                     "appMenus" : secondresult
               })
        })
        })
       	 
       })
	})
})
app.get("/listUser", function(req, res, next) {
       
       
  pool.getConnection(function(err, connection) {
    if(err) throw err;
    var sql = "SELECT * FROM user"
       connection.query(sql, function(error, firstresult) {
        if(error) throw error;
            
               
              
         res.send({
           "status": "ok",
           "result": firstresult
         })
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