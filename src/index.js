'use strict';

let config = require('../config');
let restify = require('restify');
let jwt = require('restify-jwt');
let mtgJson = require('../mtgjson.json');
let bunyan = require('bunyan');
let log = bunyan.createLogger({ name: 'rune' });
let HandlerRegistrar = require('./handlerRegistrar');

log.info('Starting up server...');

let server = restify.createServer();
server.use(jwt({ secret: config.jwtSecret }));
server.use(restify.CORS());
server.use(restify.bodyParser());

let registrar = new HandlerRegistrar(server);
registrar.register('/collections', require('./handlers/collection'));
registrar.register('/search', require('./handlers/search')(mtgJson));
registrar.register('/image/:id', require('./handlers/image'));
registrar.register('/decks', require('./handlers/decks'));
registrar.register('/auth', require('./handlers/auth'));

server.listen(config.port, function() {
    log.info(`Listening on port ${config.port}`);
});
