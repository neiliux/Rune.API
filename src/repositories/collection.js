'use strict';

let MongoClient = require('../mongoClient'),
  Observable = require('rx').Observable;

module.exports = {
  get() {
    return MongoClient.connect()
      .flatMap(onConnection)
      .subscribe(onResult, onError, onComplete);
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

function onResult(collection) {
  console.log('onResult', collection);
}

function onError(err) {
  console.log('Oh noes', err);
}

function onComplete() {
  console.log('done.');
}
