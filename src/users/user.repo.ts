import {Observable} from 'rxjs';
import {User} from './user';
import {MongoClient, DbCollection, InsertOneResult} from '../clients';

const USER_COLLECTION = 'users';

interface QueryFunction<T> {
    (connection: DbCollection): Observable<T>;
}
export class UserRepository {
    constructor(private mongo: MongoClient) {

    }

    get(username: string): Observable<User> {
        return this.connect().flatMap((collection: DbCollection): Observable<User> => {
            let fields = { _id: 0 };
            let setPromise = collection.find({username: username}).project(fields).next();
            return Observable.fromPromise(setPromise);
        });
    }

    create(user: User): Observable<User> {
        return this.connect().flatMap((collection: DbCollection): Observable<User> => {
            let setPromise = collection.insertOne(user);
            return Observable.fromPromise(setPromise).map((result: InsertOneResult): User => {
                if (result.insertedCount !== 1) {
                    throw new Error('could not create user');
                }

                return user;
            });
        });
        //return this.connectAndFlatMap(this.dbQuery<Card>({name: name}));
    }

    private connect(): Observable<DbCollection> {
        return this.mongo.connect(USER_COLLECTION);
    }

}
/*

const MongoClient = require('./mongo-client'),
  Observable = require('rx').Observable;

const CARD_COLLECTION = 'cards';

module.exports = {
  bulkFind: cardNames => {
    return MongoClient.connect().flatMap(bulkFind(cardNames));
  },
  get: cardName => {
    return MongoClient.connect().flatMap(find(cardName));
  }
};

function find(cardName) {
  return db => {
    let fields = { _id: 0 };
    let criteria = { name: cardName };
    let query = db.collection(CARD_COLLECTION).find(criteria, fields);
    return Observable.fromNodeCallback(query.next, query)();
  };
}

function bulkFind(cardNames) {
  return db => {
    let criteria = { name: { $in: cardNames } };
    let query = db.collection(CARD_COLLECTION).find(criteria);
    return Observable.fromNodeCallback(query.toArray, query)();
  };
}
*/
