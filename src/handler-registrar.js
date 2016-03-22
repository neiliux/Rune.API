'use strict';

const bunyan = require('bunyan');

let log = bunyan.createLogger({ name: 'rune' });

function HandlerRegistrar(server) {
  if (!server) {
    throw new Error('Server is required');
  }
  this.server = server;
}

HandlerRegistrar.prototype.register = function(uri, methods) {
  Object.keys(methods).map((method) => {
    log.info({ method: method, path: uri }, 'Registering route')
    let callback = methods[method];
    this.server[method](uri, callback);
  });
}

module.exports = HandlerRegistrar;
