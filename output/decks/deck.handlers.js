"use strict";
const cards_1 = require('../cards');
const permissions_1 = require('../permissions');
const rxjs_1 = require('rxjs');
const restify_1 = require('restify');
const collection_1 = require('./collection');
class CollectionHandlers {
    constructor(collectionRepo, cardRepo) {
        this.collectionRepo = collectionRepo;
        this.cardRepo = cardRepo;
    }
    get(req, res, next) {
        let userId = req.params['userId'];
        this.getCollection(userId, req.params['collectionId'])
            .subscribe(res.send.bind(res), next, next);
    }
    patch(req, res, next) {
        let errors = cards_1.validateCardsProperty(req.body);
        if (errors && errors.length) {
            return next(errors[0]);
        }
        let userId = req.params['userId'];
        let collectionId = req.params['collectionId'];
        permissions_1.requireUser(req, userId);
        let cards = req.body;
        let cardNames = cards.map((c) => c.name);
        let validCardSource = this.cardRepo.bulkFind(cardNames);
        let incomingCardSource = rxjs_1.Observable.from(req.body.cards);
        let collectionSource = this.collectionRepo.get(userId, collectionId);
        let validationSource = rxjs_1.Observable.combineLatest(validCardSource, incomingCardSource)
            .map(([dbCards, reqCard]) => {
            let valid = dbCards.some(dbCard => {
                return dbCard.name === reqCard.name && (!reqCard.set || dbCard.printings.indexOf(reqCard.set) >= 0);
            });
            if (!valid) {
                throw new restify_1.NotFoundError(`Card "${reqCard.name}" not found (in set ${reqCard.set})`);
            }
            return reqCard;
        });
        rxjs_1.Observable.combineLatest(collectionSource, validationSource)
            .reduce((acc, [collection, updatedCard]) => {
            if (updatedCard.quantity === 0) {
                this.removeAllFromCollection(collection, updatedCard);
            }
            else {
                this.upsertCard(collection, updatedCard);
            }
            return collection;
        }, null)
            .flatMap(this.collectionRepo.save)
            .subscribe(data => res.send(200), next, next);
    }
    post(req, res, next) {
        let collection = req.body;
        let username = req.user.username;
        let errors = collection_1.collectionValidator(collection);
        if (errors && errors.length) {
            let msg = errors[0].message;
            return next(new restify_1.BadRequestError(msg));
        }
        collection.username = username;
        this.collectionRepo
            .get(username, collection.name)
            .do(doc => {
            if (doc) {
                let msg = `user ${username} already has a collection named ${collection.name}`;
                throw new restify_1.ConflictError(msg);
            }
        })
            .flatMap((c) => this.collectionRepo.create(collection))
            .subscribe(data => res.send(data), next, next);
    }
    getCollection(username, collectionId) {
        return this.collectionRepo
            .get(username, collectionId)
            .do(doc => {
            if (!doc) {
                throw new restify_1.NotFoundError();
            }
        });
    }
    upsertCard(collection, card) {
        if (!card.set) {
            throw new Error('upsert card: Card must have set defined');
        }
        let collectionEntry = collection.cards.find(cards_1.cardMatchPredicate(card));
        if (collectionEntry) {
            collectionEntry.quantity = card.quantity;
        }
        else {
            if (!collection.cards) {
                collection.cards = [];
            }
            collection.cards.push(card);
        }
    }
    removeAllFromCollection(collection, card) {
        let idx = collection.cards.findIndex(cards_1.cardMatchPredicate(card));
        collection.cards.splice(idx, 1);
    }
}
exports.CollectionHandlers = CollectionHandlers;
//# sourceMappingURL=deck.handlers.js.map