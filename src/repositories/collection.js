'use strict';

let MongoClient = require('../mongoClient'),
  Observable = require('rx').Observable;

module.exports = {
  get() {
    return MongoClient.connect().flatMap(onConnection);
  }
};

function onConnection(db) {
  return Observable.create((observer) => {
    db.collection('collections').find({}).toArray((err, docs) => {
      if (err) {
        observer.onError(err);
      }
      observer.onNext(docs);
      observer.onCompleted();
    });

    return () => db.close();
  });
}
