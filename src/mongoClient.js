'use strict';

let MongoClient = require('mongodb').MongoClient,
  Observable = require('rx').Observable;

let url = 'mongodb://localhost:27017/rune';

module.exports = {
  connect: function() {
    return Observable.fromNodeCallback(MongoClient.connect)(url);
  }
}
