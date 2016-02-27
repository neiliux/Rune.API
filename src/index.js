'use strict';

var express = require('express');
var server = express();
var bodyParser = require('body-parser');
var request = require('request');
var expressJwt = require('express-jwt');
var config = require('./config');
var searchHandler = require('./search');
var imageHandler = require('./imageHandler');
var createDeckHandler = require('./createDeckHandler');
var decksHandler = require('./decksHandler');
var authenticateHandler = require('./authenticateHandler');
let HandlerRegistrar = require('./handlerRegistrar');
var mtgJson = require('../mtgjson.json');

console.log('Starting up server...');

server.use(bodyParser.json());
server.use('/api', expressJwt({ secret: config.jwtSecret }));

server.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", config.allowedHeaders);
    next();
});

let registrar = new HandlerRegistrar(server);
registrar.register('/collections', require('./handlers/collection'));

searchHandler.init(mtgJson, server);
authenticateHandler.init(server);
imageHandler.init(server);
decksHandler.init(server);
createDeckHandler.init(server);

server.listen(8080, function() {
    console.log('starting server on port 8080');
});
