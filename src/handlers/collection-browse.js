'use strict';

const collectionValidator = require('../validators/collection'),
  repo = require('../repositories/collection'),
  restify = require('restify');

module.exports = {
  post: (req, res, next) => {
    let collection = req.body;
    let username = req.user.username;
    let errors = collectionValidator(collection);

    if (errors && errors.length) {
      let msg = errors[0].message;
      return next(new restify.errors.BadRequestError(msg));
    }

    collection.username = username;

    let docSource = repo
      .get(username, collection.name)
      .do(doc => {
        if (doc) {
          let msg = `user ${username} already has a collection named ${collection.name}`;
          throw new restify.errors.ConflictError(msg);
        }
      })
      .flatMap(repo.create(collection))
      .subscribe(data => res.send(data), next, next);
  }
};
