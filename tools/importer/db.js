'use strict';

let Observable = require('rx').Observable,
  Client = require('mongodb').MongoClient;

module.exports = (url) => {
  return Observable.fromNodeCallback(Client.connect)(url);
};
