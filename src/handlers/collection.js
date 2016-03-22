'use strict';

const collectionRepo = require('../repositories/collection'),
  restify = require('restify'),
  validateCards = require('../validators/card'),
  _ = require('lodash'),
  cardRepo = require('../repositories/card'),
  permissions = require('../services/permissions'),
  Observable = require('rx').Observable;

module.exports = {
  get: (req, res, next) => {
    getCollection(req.params['userId'], req.params['collectionId'])
      .subscribe(res.send.bind(res), next, next);
  },
  patch: (req, res, next) => {
    // Validate request format
    let errors = validateCards(req.body);
    if (errors && errors.length) {
      return next(errors[0]);
    }

    permissions.requireUser(req, req.params['userId']);

    // Validate cards & sets
    let cardNames = _.map(req.body.cards, 'name');
    let validCardSource = cardRepo.bulkFind(cardNames);
    let incomingCardSource = Observable.from(req.body.cards);
    let collectionSource = collectionRepo.get(req.params['userId'], req.params['collectionId']);

    let validationSource = Observable.combineLatest(validCardSource, incomingCardSource)
      .map(cardPair => {
        let dbCards = cardPair[0],
          reqCard = cardPair[1];

        let valid = _.some(dbCards, dbCard => {
          return dbCard.name === reqCard.name && (!reqCard.set || _.indexOf(dbCard.printings, reqCard.set) >= 0);
        });

        if (!valid) {
          throw new restify.errors.NotFoundError(`Card "${reqCard.name}" not found (in set ${reqCard.set})`);
        }

        return reqCard;
      });

      Observable.combineLatest(collectionSource, validationSource)
        .reduce((acc, collectionPair) => {
          let collection = collectionPair[0],
            updatedCard = collectionPair[1];

          if (updatedCard.quantity === 0) {
            removeFromCollection(collection, updatedCard);
          } else {
            upsertCard(collection, updatedCard);
          }

          return collection;
        }, null)
        .flatMap(collectionRepo.save)
        .subscribe(data => res.send(200), next, next);
  }
};

function getCollection(userId, collectionId) {
  return collectionRepo
    .get(userId, collectionId)
    .do(doc => {
      if (!doc) throw new restify.errors.NotFoundError();
    });
}

function removeFromCollection(collection, card) {
  collection.cards = _.reject(collection.cards, colCard => {
    let sameName = colCard.name === card.name;
    let sameSet = !card.set && !colCard.set || card.set === colCard.set;
    return sameName && sameSet;
  });
}

function upsertCard(collection, card) {
  let collectionEntry = _.find(collection.cards, colCard => {
    let sameName = colCard.name === card.name;
    let sameSet = !card.set && !colCard.set || card.set === colCard.set;
    return sameName && sameSet;
  });
  if (collectionEntry) {
    colCard.quantity = card.quantity;
  } else {
    if (!collection.cards) {
      collection.cards = [];
    }
    collection.cards.push(card);
  }
}
