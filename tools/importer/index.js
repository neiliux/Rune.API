'use strict';

const config = require('./config.json'),
  extractor  = require('./file-extractor'),
  downloader = require('./file-downloader'),
  db         = require('./db'),
  setParser  = require('./set-parser');

// card file
//  -> download file
//  -> extract file
//  -> get file path

// db
//  -> connect
//  -> drop collection
//  -> insert sets
//  -> insert cards

let setStream = downloader(config.source)
  .flatMap(extractor)
  .flatMap(setParser);

// let dbStream = db(config.db);

setStream.subscribe(
  console.log,
  console.error
);
