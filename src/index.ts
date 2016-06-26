import * as restify from 'restify';
//import * as jwt from 'restify-jwt';
import * as bunyan from 'bunyan';
var reflect = require('reflect-metadata');
import {SearchHandler} from './search/search.handler';
import {HandlerRegistrar} from './handler-registrar';

const config       = require('../config'),
  log              = bunyan.createLogger({ name: 'rune' });

log.info('Starting up server...');

let server = restify.createServer();
// TODO: GET JWT WORKING
//server.use(jwt({ secret: config.jwtSecret }).unless({ path: ['/users', '/auth'] }));
server.use(restify.CORS());
server.use(restify.bodyParser());
server.use(restify.queryParser({ mapParams: false }));

let registrar = new HandlerRegistrar(server);

registrar.register('/search', new SearchHandler(require('./mtgjson.json')));

// TODO: Finish port to TS
//registrar.register('/cards/:id', CardHandler);
//registrar.register('/users', require('./handlers/user-browse.js'));
//registrar.register('/collections/', require('./handlers/collection-browse'));
//registrar.register('/collections/:userId/:collectionId', require('./handlers/collection'));
//registrar.register('/decks', require('./handlers/decks'));
//registrar.register('/auth', require('./handlers/auth'));
//registrar.register('/sets', require('./handlers/set-browse'));
//registrar.register('/sets/:id', require('./handlers/set'));

server.on('after', (req, res, route, err) => {
  logRequest(req, res, err);
});

server.on('uncaughtException', (req, res, route, err) => {
  logRequest(req, res, err);
  res.send(err);
});

server.listen(config.port, function() {
    log.info(`Listening on port ${config.port}`);
});

function logRequest(req, res, err) {
  let level = err ? 'error' : 'info';
  if (err) {
    log.error(err);
  }
  log[level]({ method: req.method, statusCode: res.statusCode, path: req.path() });
}
