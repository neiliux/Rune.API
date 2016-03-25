'use strict';

const setRepo = require('../repositories/set');

module.exports = {
  get: (req, res, next) => {
    setRepo.get().subscribe(data => res.send(data), next, next);
  }
};
