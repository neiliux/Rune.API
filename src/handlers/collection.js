'use strict';

const collectionRepo = require('../repositories/collection'),
  restify = require('restify');

module.exports = {
  get: function(req, res, next) {
    collectionRepo
      .get(req.params['userId'], req.params['collectionId'])
      .map(doc => {
        if (!doc) throw new restify.errors.NotFoundError();
        return doc;
      })
      .subscribe(res.send.bind(res), next, next);
  }
};
