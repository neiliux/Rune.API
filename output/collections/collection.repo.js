'use strict';
const rxjs_1 = require('rxjs');
const COLLECTION_COLLECTION = 'collections';
class CollectionRepository {
    constructor(client) {
        this.client = client;
    }
    get(username, collectionName) {
        return this.getDbCollection().flatMap(this.getCollection(username, collectionName));
    }
    create(collection) {
        return this.getDbCollection().flatMap(this.createCollection(collection));
    }
    save(collection) {
        return this.getDbCollection().flatMap(this.saveCollection(collection));
    }
    getDbCollection() {
        return this.client.connect(COLLECTION_COLLECTION);
    }
    createCollection(collection) {
        return (c) => {
            return rxjs_1.Observable.fromPromise(c.insertOne(collection)).map((op) => {
                return op.result.ok > 0 ? collection : null;
            });
        };
    }
    getCollection(username, collectionName) {
        return (c) => {
            let criteria = { username: username, name: collectionName };
            let query = c.find(criteria).limit(1);
            return rxjs_1.Observable.fromPromise(query.next());
        };
    }
    saveCollection(newCollection) {
        return (c) => {
            let criteria = { username: newCollection.username, name: newCollection.name };
            let promise = c.findOneAndReplace(criteria, newCollection);
            return rxjs_1.Observable.fromPromise(promise).map((op) => op.value);
        };
    }
}
exports.CollectionRepository = CollectionRepository;
//# sourceMappingURL=collection.repo.js.map