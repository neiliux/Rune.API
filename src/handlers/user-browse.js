'use strict';

const userValidator = require('../validators/user'),
  restify = require('restify'),
  bunyan = require('bunyan'),
  scrypt = require('scrypt'),
  Observable = require('rx').Observable,
  userRepo = require('../repositories/user');

const log = bunyan.createLogger({ name: 'userBrowse' });

module.exports = {
  post: (req, res, next) => {
    let user = req.body;

    let errors = userValidator(user);
    if (errors && errors.length) {
      return next(new restify.errors.BadRequestError(errors[0].message));
    }

    Observable.create((subscriber) => {
      scrypt.kdf(user.password, { N: 1, r: 1, p: 1 }, (err, result) => {
        err && subscriber.onError(err);
        user.password = result.toString('base64');
        subscriber.onNext(user);
        subscriber.onCompleted();
      });
    }).map(user => user.username)
      .flatMap(userRepo.get)
      .flatMap((data) => {
        if (data) {
          let msg = `The username "${user.username}" is not available`;
          throw new restify.errors.ConflictError(msg);
        }
        return userRepo.create(user);
      })
      .subscribe((savedUser) => {
        res.send(savedUser);
        next();
      }, (err) => {
        log.error(err);
        next(err);
      });
  }
};
