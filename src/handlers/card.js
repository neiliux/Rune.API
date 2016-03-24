'use strict';

const cardRepo = require('../repositories/card'),
  restify = require('restify');

module.exports = {
  get: (req, res, next) => {
    return cardRepo.get(req.params['id'], req.query['set'])
      .do(card => {
        if (!card) {
          throw new restify.errors.NotFoundError();
        }
      })
      .subscribe(data => res.send(data), next, next);
  }
};
