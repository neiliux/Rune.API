'use strict';

const MongoClient = require('./mongo-client'),
  Observable = require('rx').Observable;

const SET_COLLECTION = 'sets';

module.exports = {
  get: set => {
    return set
      ? getSet(set)
      : allSets();
  }
};

function getSet(set) {
  return MongoClient.connect().flatMap(db => {
    let criteria = { code: set };
    let fields = { _id: 0, name: 1, code: 1, releaseDate: 1, block: 1, onlineOnly: 1, 'cards.name': 1, 'cards.number': 1 };
    let query = db.collection(SET_COLLECTION).find(criteria, fields).limit(1);
    return Observable.fromNodeCallback(query.next, query)();
  });
}

function allSets() {
  return MongoClient.connect().flatMap(db => {
    let fields = { _id: 0, name: 1, code: 1, releaseDate: 1, block: 1, onlineOnly: 1 };
    let query = db.collection(SET_COLLECTION).find({ }, fields);
    return Observable.fromNodeCallback(query.toArray, query)();
  });
}
