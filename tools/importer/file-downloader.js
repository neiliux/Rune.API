'use strict';

let http = require('http'),
  Observable = require('rx').Observable;

module.exports = (url) => {
  return Observable.fromCallback(http.get)(url);
};
