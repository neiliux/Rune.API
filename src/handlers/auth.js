'use strict';

const jwt = require('jsonwebtoken'),
  config = require('../../config'),
  scrypt = require('scrypt'),
  Observable = require('rx').Observable,
  userRepo = require('../repositories/user');

const expires = 60 * 100;

module.exports = {
  post: (req, res, next) => {
    let username = req.body.username,
      password = req.body.password;

    userRepo.get(username)
      .flatMap((user) => {
        return Observable.create((subscriber) => {
          let validPass = new Buffer(user.password, 'base64');
          scrypt.verifyKdf(validPass, password, (err, result) => {
            err && subscriber.onError(err);
            subscriber.onNext(result);
            subscriber.onCompleted();
          });
        });
      })
      .subscribe(
        (success) => {
          let tokenData = { username: username };
          let token = jwt.sign(tokenData, config.jwtSecret, { expiresIn: expires });
          res.send({
            token: token
          });
          next();
        }, next);
  }
};
