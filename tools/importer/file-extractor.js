'use strict';

const unzip  = require('unzip'),
  Observable = require('rx').Observable,
  tmp        = require('tmp'),
  path       = require('path'),
  bunyan     = require('bunyan');

const fileName = 'AllSets-x.json';
const log = bunyan.createLogger({ name: 'extract' });

module.exports = (fileStream) => {
  return Observable.fromNodeCallback(tmp.dir)()
    .map((fileMeta) => {
      log.info(`Extracting into "${fileName}"`);
      let tmpDir = fileMeta[0];
      let filePath = path.join(tmpDir, fileName);
      return {
        dir:    tmpDir,
        file:   filePath,
        stream: fileStream
      };
    })
    .flatMap(extractFile);
};

function extractFile(data) {
  log.debug(`Extracting data to ${data.dir}`);
  let outStream = data.stream.pipe(unzip.Extract({ path: data.dir }));
  return fromWritableStream(outStream)
    .map((stream) => data.file);
}

function fromWritableStream(stream) {
  return Observable.create((subscriber) => {
    stream.on('error', subscriber.onError.bind(subscriber));
    stream.on('close', () => {
      subscriber.onNext(stream);
      subscriber.onCompleted();
    });
  });
}
