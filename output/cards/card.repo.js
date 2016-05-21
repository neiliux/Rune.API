"use strict";
const rxjs_1 = require('rxjs');
const CARD_COLLECTION = 'cards';
class CardRepository {
    constructor(mongo) {
        this.mongo = mongo;
    }
    get(name) {
        return this.connectAndFlatMap(this.dbQuery({ name: name }));
    }
    bulkFind(cardNames) {
        return this.connectAndFlatMap(this.dbQuery({ name: { $in: cardNames } }));
    }
    connectAndFlatMap(query) {
        return this.mongo.connect(CARD_COLLECTION).flatMap(query);
    }
    dbQuery(critera) {
        return (collection) => {
            let fields = { _id: 0 };
            let setPromise = collection.find(critera).project(fields).next();
            return rxjs_1.Observable.fromPromise(setPromise);
        };
    }
}
exports.CardRepository = CardRepository;
/*

const MongoClient = require('./mongo-client'),
  Observable = require('rx').Observable;

const CARD_COLLECTION = 'cards';

module.exports = {
  bulkFind: cardNames => {
    return MongoClient.connect().flatMap(bulkFind(cardNames));
  },
  get: cardName => {
    return MongoClient.connect().flatMap(find(cardName));
  }
};

function find(cardName) {
  return db => {
    let fields = { _id: 0 };
    let criteria = { name: cardName };
    let query = db.collection(CARD_COLLECTION).find(criteria, fields);
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
*/
//# sourceMappingURL=card.repo.js.map