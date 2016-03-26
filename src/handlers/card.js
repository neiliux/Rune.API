'use strict';

const cardRepo = require('../repositories/card'),
  setRepo = require('../repositories/set'),
  restify = require('restify');

module.exports = {
  get: (req, res, next) => {
    let cardName = req.params['id'],
      set = req.query['set'];

    let cardSource = set
      ? setRepo.getCard(set, cardName)
      : cardRepo.get(cardName);

    return cardSource
      .do(card => {
        if (!card) {
          throw new restify.errors.NotFoundError();
        }
      })
      .subscribe(data => res.send(data), next, next);
  }
};
