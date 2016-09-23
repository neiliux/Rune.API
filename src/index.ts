import * as restify from 'restify';
//import * as jwt from 'restify-jwt';
var jwt = require('restify-jwt');
import * as bunyan from 'bunyan';
var reflect = require('reflect-metadata');
import {SearchHandler} from './search/search.handler';
import {HandlerRegistrar} from './handler-registrar';
import {SetHandlers} from './sets/set.handlers';
import {SetRepository} from './sets/set.repo';
import {MongoClient} from './clients/mongo';
import {SetCodeHandlers} from './sets/set.code.handlers';
import {CardRepository} from './cards/card.repo';
import {CardHandler} from './cards/card.handler';
import {CollectionGetHandler} from './collections/collection.get.handler';
import {CollectionPostHandler} from './collections/collection.post.handler';
import {CollectionRepository} from './collections/collection.repo';
import {AuthenticationHandler} from './authentication/authentication';
import {UserRepository} from './users/user.repo';
import {UserPostHandler} from './users/user.post.handler';

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

//registrar.register('/auth', new AuthenticationHandler(new UserRepository(new MongoClient())));
registrar.register('/search', new SearchHandler(require('./mtgjson.json')));
//registrar.register('/sets/', new SetHandlers(new SetRepository(new MongoClient())));
//registrar.register('/sets/code/:id', new SetCodeHandlers(new SetRepository(new MongoClient())));
//registrar.register('/cards/', new CardHandler(new CardRepository(new MongoClient()), new SetRepository(new MongoClient())));
//registrar.register('/collections/', new CollectionPostHandler(new CollectionRepository(new MongoClient())));
//registrar.register('/collections/:userId/:collectionId', new CollectionGetHandler(new CollectionRepository(new MongoClient())));
//registrar.register('/users', new UserPostHandler(new UserRepository(new MongoClient())));

// TODO: Finish port to TS
//registrar.register('/users', require('./handlers/user-browse.js'));
//registrar.register('/decks', require('./handlers/decks'));

server.on('after', (req, res, route, err) => {
  logRequest(req, res, err);
});

server.on('uncaughtException', (req, res, route, err) => {
  logRequest(req, res, err);
  res.send(err);
});

server.listen(config.port, function() {
    console.log('bleh');
    log.info(`Listening on port ${config.port}`);
});

function logRequest(req, res, err) {
  let level = err ? 'error' : 'info';
  if (err) {
    log.error(err);
  }
  log[level]({ method: req.method, statusCode: res.statusCode, path: req.path() });
}
