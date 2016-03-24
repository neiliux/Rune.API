'use strict';

const MongoClient = require('./mongoClient'),
  Observable = require('rx').Observable;

const COLLECTION_COLLECTION = 'collections';

module.exports = {
  get: (username, collectionName) => {
    return MongoClient.connect().flatMap(getCollection(username, collectionName));
  },
  create: collection => {
    return MongoClient.connect().flatMap(createCollection(collection));
  },
  save: collection => {
    return MongoClient.connect().flatMap(saveCollection(collection));
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

function saveCollection(newCollection) {
  return (db) => {
    let criteria = { username: newCollection.username, name: newCollection.name };
    let query = db.collection(COLLECTION_COLLECTION);
    return Observable.fromNodeCallback(query.findOneAndReplace, query)(criteria, newCollection);
  };
}
