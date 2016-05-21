'use strict';
const rxjs_1 = require('rxjs');
const DECK_COLLECTION = 'decks';
class DeckRepository {
    constructor(client) {
        this.client = client;
    }
    get(username, deckName) {
        return this.getDbCollection().flatMap(this.getDeck(username, deckName));
    }
    create(deck) {
        return this.getDbCollection().flatMap(this.createDeck(deck));
    }
    save(deck) {
        return this.getDbCollection().flatMap(this.saveDeck(deck));
    }
    getDbCollection() {
        return this.client.connect(DECK_COLLECTION);
    }
    createDeck(deck) {
        return (c) => {
            return rxjs_1.Observable.fromPromise(c.insertOne(collection)).map((op) => {
                return op.result.ok > 0 ? collection : null;
            });
        };
    }
    getDeck(username, deckName) {
        return (c) => {
            let criteria = { username: username, name: deckName };
            let query = c.find(criteria).limit(1);
            return rxjs_1.Observable.fromPromise(query.next());
        };
    }
    saveDeck(newDeck) {
        return (c) => {
            let criteria = { username: newDeck.username, name: newDeck.name };
            let promise = c.findOneAndReplace(criteria, newDeck);
            return rxjs_1.Observable.fromPromise(promise).map((op) => op.value);
        };
    }
}
exports.DeckRepository = DeckRepository;
//# sourceMappingURL=deck.repo.js.map