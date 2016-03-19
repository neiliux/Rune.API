'use strict';

const MongoClient = require('../mongo-client'),
  Observable = require('rx').Observable;

const COLLECTION_COLLECTION = 'collections';

module.exports = {
  get: (username, collectionName) => {
    return MongoClient.connect().flatMap(getCollection(username, collectionName));
  },
  create: (collection) => {
    return MongoClient.connect().flatMap(createCollection(collection));
  }
};

function createCollection(collection) {
  return (db) => {
    let query = db.collection(COLLECTION_COLLECTION);
    return Observable.fromNodeCallback(query.insertOne, query)(collection);
  };
}

function getCollection(username, collectionName) {
  return (db) => {
    let criteria = { username: username, name: collectionName };
    let query = db.collection(COLLECTION_COLLECTION).find(criteria).limit(1);
    return Observable.fromNodeCallback(query.next, query)();
  }
}
