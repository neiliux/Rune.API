'use strict';

const MongoClient = require('../mongo-client'),
  Observable = require('rx').Observable;

const USER_COLLECTION = 'users';

module.exports = {
  get: (username) => {
    return MongoClient.connect().flatMap((db) => {
      return Observable.create((subscriber) => {
        db.collection(USER_COLLECTION, (err, col) => {
          if (err) subscriber.onError(err);
          col.find({ username: username  }).limit(1).next((err, doc) => {
            if (err) subscriber.onError(err);
            subscriber.onNext(doc);
            subscriber.onCompleted();
          });
        })
      });

      return _ => db.close();
    });
  },

  create: (user) => {
    return MongoClient.connect().flatMap((db) => {
      return Observable.create((subscriber) => {
        db.collection(USER_COLLECTION, (err, col) => {
          if (err) subscriber.onError(err);
          col.insertOne(user, (err, result) => {
            if (err) subscriber.onError(err);
            subscriber.onNext(result);
            subscriber.onCompleted();
          });
        });
      });

      return _ => db.close();
    });
  }
};
