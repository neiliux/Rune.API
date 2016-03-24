'use strict';

const MongoClient = require('./mongo-client'),
  Observable = require('rx').Observable;

const USER_COLLECTION = 'users';

module.exports = {
  get: (username) => {
    return MongoClient.connect().flatMap((db) => {
      let criteria = { username: username };
      let query = db.collection(USER_COLLECTION).find(criteria).limit(1);
      return Observable.fromNodeCallback(query.next, query)();
    });
  },

  create: (user) => {
    return MongoClient.connect().flatMap((db) => {
      let query = db.collection(USER_COLLECTION);
      return Observable.fromNodeCallback(query.insertOne, query)(user);
    });
  }
};
