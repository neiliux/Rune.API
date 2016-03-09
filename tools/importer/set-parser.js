'use strict';

const fs       = require('fs'),
  Observable   = require('rx').Observable,
  StreamObject = require('stream-json/utils/StreamObject');

module.exports = (filePath) => {
  return Observable.create((subscriber) => {
    let stream = StreamObject.make();

    stream.output.on('err', susbcriber.onError.bind(subscriber));

    stream.output.on('data', (object) => {
      subscriber.onNext(object.value);
    });

    stream.output.on('end', () => {
      subscriber.onCompleted();
    });

    fs.createReadStream(filePath)
      .pipe(stream.input);
  });
};
