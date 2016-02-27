var jwt = require('jsonwebtoken');
var config = require('./config');
var handler = {};
var host;

function createEndpoints() {
    host.post('/authenticate', authenticatePost);
}

function authenticatePost(req, res) {
   var userContext = {
    firstName: 'foo',
    lastName: 'bar',
    userId: 1
   };

   var token =
       jwt.sign(userContext, config.jwtSecret, { expiresIn: 60*100 });
   
   res.json({ token: token });
}

handler.init = function(server) {
    host = server;
    createEndpoints();
};

module.exports = handler;
