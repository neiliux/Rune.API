'use strict';

let MongoClient = require('mongodb').MongoClient,
  Observable = require('rx').Observable;

let url = 'mongodb://localhost:27017/test';

module.exports = {
  connect: function() {
    return Observable.create((observer) => {
      MongoClient.connect(url, (err, db) => {
        if (err) {
          observer.onError(err);
        } else {
          observer.onNext(db);
        }
        observer.onCompleted();
      });
    });
  }
}
