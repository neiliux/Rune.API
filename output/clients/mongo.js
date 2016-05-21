"use strict";
const mongodb_1 = require('mongodb');
const rxjs_1 = require('rxjs');
const MDB_URL = 'mongodb://localhost:27017/rune';
class MongoClient {
    constructor() {
    }
    connect(collectionName) {
        return new rxjs_1.Observable((subscriber) => {
            mongodb_1.MongoClient.connect(MDB_URL, (dbError, db) => {
                if (dbError) {
                    subscriber.error(dbError);
                    subscriber.complete();
                    return;
                }
                db.collection(collectionName, (cError, collection) => {
                    if (cError) {
                        subscriber.error(cError);
                    }
                    else {
                        subscriber.next(collection);
                    }
                    subscriber.complete();
                });
            });
        });
    }
}
exports.MongoClient = MongoClient;
//# sourceMappingURL=mongo.js.map