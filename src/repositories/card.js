'use strict';

const MongoClient = require('./mongo-client'),
  Observable = require('rx').Observable;

const CARD_COLLECTION = 'cards';

module.exports = {
  bulkFind: cardNames => {
    return MongoClient.connect().flatMap(bulkFind(cardNames));
  },
  get: (cardName, set) => {
    return MongoClient.connect().flatMap(find(cardName, set));
  }
};

function find(cardName, set) {
  return db => {
    let criteria = { name: cardName };
    if (set) {
      criteria['printings'] = { $elemMatch: { $eq: set } }
    }
    let query = db.collection(CARD_COLLECTION).find(criteria);
    return Observable.fromNodeCallback(query.next, query)();
  };
}

function bulkFind(cardNames) {
  return db => {
    let criteria = { name: { $in: cardNames } };
    let query = db.collection(CARD_COLLECTION).find(criteria);
    return Observable.fromNodeCallback(query.toArray, query)();
  };
}
