'use strict';

const config = require('./config.json'),
  extractor  = require('./file-extractor'),
  downloader = require('./file-downloader'),
  db         = require('./db'),
  Observable = require('rx').Observable,
  setParser  = require('./set-parser'),
  dbDrop     = require('./db-drop'),
  dbInsert   = require('./db-insert'),
  bunyan     = require('bunyan');

const SET_COLLECTION = 'sets';

let log = bunyan.createLogger({ name: 'index' });

let setStream = downloader(config.source)
  .flatMap(extractor)
  .flatMap(setParser);

let dbStream = db(config.db);
let dropStream = dbStream.flatMap(dbDrop(SET_COLLECTION));

Observable.combineLatest(dropStream, setStream)
  .flatMap(dbInsert(SET_COLLECTION))
  .subscribe(
    () => { },
    log.error,
    () => {
      dbStream.subscribe((db) => db.close());
      log.info('Done.')
    });
