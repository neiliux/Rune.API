
import {Card} from '../cards';
import {CardSet, CardSetList} from './set';
import {MongoClient, DbCollection} from '../clients';
import {Observable} from 'rxjs';

const SET_COLLECTION = 'sets';

export class SetRepository {
    constructor(private mongo: MongoClient) {

    }
    get(set?: string): Observable< CardSet | CardSetList > {
      return !!set
        ? this.getSet(set)
        : this.allSets();
    }

    private getSet(setName: string): Observable<CardSet> {
        return this.getSetCollection().flatMap((collection: DbCollection): Observable<CardSet> => {
            let fields = { _id: 0, name: 1, code: 1, releaseDate: 1, block: 1, onlineOnly: 1 };
            let setPromise = collection.find({name: setName}).project(fields).next();
            return Observable.fromPromise(setPromise);
        });
    }
    private allSets(): Observable< CardSet > {
        return this.getSetCollection().flatMap((collection: DbCollection): Observable<CardSetList> => {
            let fields = { _id: 0, name: 1, code: 1, releaseDate: 1, block: 1, onlineOnly: 1 };
            let setListPromise = collection.find({}).project(fields).toArray();
            return Observable.fromPromise(setListPromise);
            // return new Observable((subscriber) => {
            //     collection.find({}).project(fields).toArray().then((sets: CardSetList) => {
            //         sets.forEach(set => subscriber.next(sets));
            //     });
            // });
        });
    }

    private getSetCollection(): Observable<DbCollection> {
        return this.mongo.connect(SET_COLLECTION);
    }

    getCard(set: string, cardName: string): Observable< Card > {
      return Observable.throw({}); //this.getSetCollection().flatMap(getCard(set, cardName));
    }
}
