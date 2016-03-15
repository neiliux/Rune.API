'use strict';

let bunyan = require('bunyan');
let log = bunyan.createLogger({ name: 'rune' });

module.exports = function(req, res, next) {
  log.info(`${req.ip} ${req.method} ${req.path}`);
  next();
}
