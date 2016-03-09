'use strict';

let Observable = require('rx').Observable;

module.exports = (db) => {
  return Observable.create((subscriber) => {
    subscriber.onCompleted();

    return db.close.bind(db);
  });
}
