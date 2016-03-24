'use strict';

const collectionValidator = require('../validators/collection');

module.exports = {
  post: (req, res, next) => {
    let collection = req.body;
    collectionValidator(collection);
    res.send(200);
    next();
  }
};
