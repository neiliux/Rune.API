'use strict';

module.exports = {
  get: (req, res, next) => {
    res.send(200);
    next();
  }
};
