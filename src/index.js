'use strict';

var server = require('express')();
var bodyParser = require('body-parser');
var request = require('request');
var expressJwt = require('express-jwt');
var config = require('./config');
var searchHandler = require('./search');
var imageHandler = require('./imageHandler');
var createDeckHandler = require('./createDeckHandler');
var decksHandler = require('./decksHandler');
var authenticateHandler = require('./authenticateHandler');
var mtgJson = require('../mtgjson.json');

let bunyan = require('bunyan');
let log = bunyan.createLogger({ name: 'rune' });
let HandlerRegistrar = require('./handlerRegistrar');
let requestLogger = require('./request-logger');


log.info('Starting up server...');

server.use(requestLogger);
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
    log.info('Listening on port 8080');
});
