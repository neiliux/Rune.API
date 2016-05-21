import {Observable} from 'rxjs';
import {Card, CardList} from './card';
import {MongoClient, DbCollection} from '../clients';

const CARD_COLLECTION = 'cards';

interface QueryFunction<T> {
    (connection: DbCollection): Observable<T>;
}
export class CardRepository {
    constructor(private mongo: MongoClient) {

    }

    get(name: string): Observable<Card> {
        return this.connectAndFlatMap(this.dbQuery<Card>({name: name}));
    }


    bulkFind(cardNames: Array<string>): Observable<CardList> {
        return this.connectAndFlatMap(this.dbQuery<CardList>({name: {$in: cardNames}}));
    }

    private connectAndFlatMap<T>(query: QueryFunction<T>) {
        return this.mongo.connect(CARD_COLLECTION).flatMap(query);
    }

    private dbQuery<T>(critera: Object) {
        return (collection: DbCollection): Observable<T> => {
            let fields = { _id: 0 };
            let setPromise = collection.find(critera).project(fields).next();
            return Observable.fromPromise(setPromise);
        };
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
