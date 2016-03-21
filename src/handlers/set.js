'use strict';

const setRepo = require('../repositories/set'),
  restify = require('restify');

module.exports = {
  get: (req, res, next) => {
    return setRepo.get(req.params['id'])
      .do(set => {
        if (!set) {
          throw new restify.errors.NotFoundError();
        }
      })
      .subscribe(data => res.send(data), next, next);
  }
};
