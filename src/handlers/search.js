'use strict';

let lodash = require('lodash');
let _cachedMtgJson = null;

module.exports = (mtgJson) => {
  _cachedMtgJson = mtgJson;
  return handlers;
};

let handlers = {
  post: (req, res, next) => {
    let searchRequest = req.body;
    let result = search(searchRequest.searchText);

    res.json(result);
    next();
  }
};

function search(name) {
  let matchingCards = [];

  lodash.each(_cachedMtgJson, function(set) {
    lodash.each(set.cards, function(card) {
      let regEx = new RegExp(name, 'i');
      if (regEx.test(card.name)) {
        matchingCards.push(card);
      }
    });
  });

  console.log('search found', matchingCards.length, 'cards');
  return matchingCards;
}
