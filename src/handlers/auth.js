'use strict';

let jwt = require('jsonwebtoken');
let config = require('../../config');

module.exports = {
  post: (req, res, next) => {
    let userContext = {
      firstName: 'foo',
      lastName: 'bar',
      userId: 1
    };

    let expires = 60 * 100;
    let token = jwt.sign(userContext, config.jwtSecret, { expiresIn: expires });
    res.json({ token: token });
    next();
  }
};
