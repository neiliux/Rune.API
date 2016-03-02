'use strict';

let config   = require('./config.json'),
  extractor  = require('./file-extractor'),
  downloader = require('./file-download'),
  db         = require('./db'),
  dbClose    = require('./db-close')
  dbDrop     = require('./db-drop'),
  dbInsert   = require('./db-insert');

let cards = [ ];

downloader(config.source)
  .flatMap(extractor('output'))
  .flatMap(parseCards)
  .subscribe(updateDb);

function updateDb(sets) {
  db(config.database)
    .flatMap(dbDrop('sets'))
    .flatMap(dbInsert('sets', sets))
    .flatMap(dbClose)
    .subscribe(
      () => console.log('Done.')
    );
}

function parseCards(jsonFilePath) {
  return Observable.create((subscriber) => {
    fs.readFile(jsonFilePath, (err, { encoding: 'utf8' } data) => {
      if (err) {
        subscriber.onError(err);
      }

      let sets = Object.keys(data).map((setCode) => {
        return data[setCode];
      });
      subscriber.onNext(sets);

      subscriber.onCompleted();
    });
  });
}
