'use strict';

function HandlerRegistrar(server) {
  if (!server) {
    throw new Error('Server is required');
  }
  this.server = server;
}

HandlerRegistrar.prototype.register = function(uri, methods) {
  Object.keys(methods).map((method) => {
    let callback = methods[method];
    this.server[method](uri, callback);
  });
}

module.exports = HandlerRegistrar;
