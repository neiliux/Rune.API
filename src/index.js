'use strict';

const config       = require('../config'),
  restify          = require('restify'),
  jwt              = require('restify-jwt'),
  bunyan           = require('bunyan'),
  log              = bunyan.createLogger({ name: 'rune' }),
  HandlerRegistrar = require('./handler-registrar');

log.info('Starting up server...');

let server = restify.createServer();
server.use(jwt({ secret: config.jwtSecret }).unless({ path: ['/users', '/auth'] }));
server.use(restify.CORS());
server.use(restify.bodyParser());

let registrar = new HandlerRegistrar(server);
registrar.register('/users', require('./handlers/user-browse'));
registrar.register('/collections/:userId', require('./handlers/collection-browse'));
// registrar.register('/collections/:userId/:collectionId', require('./handlers/collection'));
registrar.register('/image/:id', require('./handlers/image'));
registrar.register('/decks', require('./handlers/decks'));
registrar.register('/auth', require('./handlers/auth'));

server.on('after', (req, res, route, err) => {
  let msg = `${req.method} ${res.statusCode} ${req.path()}`;
  if (err) {
    log.error(err, msg);
  } else {
    log.info(msg);
  }
});

server.listen(config.port, function() {
    log.info(`Listening on port ${config.port}`);
});
