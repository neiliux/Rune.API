'use strict';

let unzip = require('unzip'),
  Observable = require('rx').Observable;

module.exports = (path) => {
  return (inStream) => {
    return Observable.create((subscriber) => {
      let outStream = inStream.pipe(unzip.Extract({ path: path }));
      outStream.on('error', subscriber.onError.bind(subscriber));
      outStream.on('close', () => {
        subscriber.onNext(outStream.path);
        subscriber.onCompleted();
      });
    });
  };
};
