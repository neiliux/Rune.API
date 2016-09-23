import {Card} from '../cards';
import {CardSet, CardSetList} from './set';
import {MongoClient, DbCollection} from '../clients';
import {Observable} from 'rxjs';

const SET_COLLECTION = 'sets';
const fields = { _id: 0, name: 1, code: 1, releaseDate: 1, block: 1, onlineOnly: 1 };

export class SetRepository {
    constructor(private mongo: MongoClient) { }
    
    get(set?: string): Observable< CardSet | CardSetList > {
      return !!set
        ? this.getSet(set)
        : this.allSets();
    }

    private getSet(setName: string): Observable<CardSet> {
        return this.getSetCollection().flatMap((collection: DbCollection): Observable<CardSet> => {
            let setPromise = collection
                // TODO: This has got to be slow...
                .find({ $or: [{name: new RegExp(setName, 'i')}, {code: new RegExp(setName, 'i')}] })
                .project(fields)
                .toArray();
            
            return Observable.fromPromise(setPromise);
        });
    }

    private allSets(): Observable<CardSet> {
        return this.getSetCollection().flatMap((collection: DbCollection): Observable<CardSetList> => {
            let setListPromise = collection.find({}).project(fields).toArray();
            return Observable.fromPromise(setListPromise);
        });
    }

    private getSetCollection(): Observable<DbCollection> {
        return this.mongo.connect(SET_COLLECTION);
    }

    // TODO: Move to correct repo
    getCard(set: string, cardName: string): Observable< Card > {
      return Observable.throw({}); //this.getSetCollection().flatMap(getCard(set, cardName));
    }
}