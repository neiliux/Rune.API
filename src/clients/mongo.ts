/* tslint:disable:no-unused-variable */
import {MongoClient as mongo, Db, DbCollectionOptions, Collection, MongoCallback, MongoError} from 'mongodb';
import {Observable} from 'rxjs';
export interface DbCollection extends Collection {}

export {CursorResult, InsertOneWriteOpResult as InsertOneResult} from 'mongodb';
const MDB_URL = 'mongodb://localhost:27017/rune';

export class MongoClient {
    constructor() {
    }

    connect(collectionName: string): Observable<DbCollection> {
        return new Observable<DbCollection>((subscriber) => {
            mongo.connect(MDB_URL, (dbError: MongoError, db: Db) => {
                if (dbError) {
                    subscriber.error(dbError);
                    subscriber.complete();
                    return;
                }
                db.collection(collectionName, (cError: MongoError, collection: DbCollection) => {
                    if (cError) {
                        subscriber.error(cError);
                    } else {
                        subscriber.next(collection);
                    }
                    subscriber.complete();
                });
            });
        });
    }
}
