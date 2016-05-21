"use strict";
const rxjs_1 = require('rxjs');
const SET_COLLECTION = 'sets';
class SetRepository {
    constructor(mongo) {
        this.mongo = mongo;
    }
    get(set) {
        return !!set
            ? this.getSet(set)
            : this.allSets();
    }
    getSet(setName) {
        return this.getSetCollection().flatMap((collection) => {
            let fields = { _id: 0, name: 1, code: 1, releaseDate: 1, block: 1, onlineOnly: 1 };
            let setPromise = collection.find({ name: setName }).project(fields).next();
            return rxjs_1.Observable.fromPromise(setPromise);
        });
    }
    allSets() {
        return this.getSetCollection().flatMap((collection) => {
            let fields = { _id: 0, name: 1, code: 1, releaseDate: 1, block: 1, onlineOnly: 1 };
            let setListPromise = collection.find({}).project(fields).toArray();
            return rxjs_1.Observable.fromPromise(setListPromise);
        });
    }
    getSetCollection() {
        return this.mongo.connect(SET_COLLECTION);
    }
    getCard(set, cardName) {
        return rxjs_1.Observable.throw({});
    }
}
exports.SetRepository = SetRepository;
//# sourceMappingURL=set.repo.js.map