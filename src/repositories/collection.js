'use strict';

const MongoClient = require('../mongoClient'),
  Observable = require('rx').Observable;

module.exports = {
  get() {
    return MongoClient.connect().flatMap((db) => {
      let query = db.collection('collections').find({}).toArray;
      return Observable.fromNodeCallback(query)();
    });
  }
};
