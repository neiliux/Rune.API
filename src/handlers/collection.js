'use strict';

let collectionRepo = require('../repositories/collection');

module.exports = {
  get: function(req, res, next) {
    collectionRepo.get().subscribe(
      (docs) => res.send(docs),
      (err) => res.status(500).end()
    );
  }
};
