"use strict";
const rxjs_1 = require('rxjs');
const USER_COLLECTION = 'users';
class UserRepository {
    constructor(mongo) {
        this.mongo = mongo;
    }
    get(username) {
        return this.connect().flatMap((collection) => {
            let fields = { _id: 0 };
            let setPromise = collection.find({ username: username }).project(fields).next();
            return rxjs_1.Observable.fromPromise(setPromise);
        });
    }
    create(user) {
        return this.connect().flatMap((collection) => {
            let setPromise = collection.insertOne(user);
            return rxjs_1.Observable.fromPromise(setPromise).map((result) => {
                if (result.insertedCount !== 1) {
                    throw new Error('could not create user');
                }
                return user;
            });
        });
    }
    connect() {
        return this.mongo.connect(USER_COLLECTION);
    }
}
exports.UserRepository = UserRepository;
//# sourceMappingURL=user.repo.js.map