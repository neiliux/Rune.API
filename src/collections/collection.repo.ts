'use strict';
import {Collection} from './collection';
import {MongoClient, DbCollection} from '../clients';
import {Observable} from 'rxjs';

const COLLECTION_COLLECTION = 'collections';

interface DbCollectionOpFunciton { (c: DbCollection): Observable<Collection>; }
export class CollectionRepository {
  constructor(private client: MongoClient) {
  }

  get(username: string, collectionName: string): Observable<Collection> {
    return this.getDbCollection().flatMap(this.getCollection(username, collectionName));
  }

  create(collection): Observable<Collection> {
    return this.getDbCollection().flatMap(this.createCollection(collection));
  }

  save(collection: Collection): Observable<Collection> {
    return this.getDbCollection().flatMap(this.saveCollection(collection));
  }

  private getDbCollection(): Observable<DbCollection> {
    return this.client.connect(COLLECTION_COLLECTION);
  }

  private createCollection(collection: Collection): DbCollectionOpFunciton {
    return (c: DbCollection): Observable<Collection> => {
      return Observable.fromPromise(c.insertOne(collection)).map((op) => {
        return op.result.ok > 0 ? collection : null;
      });
    };
  }

  private getCollection(username: string, collectionName: string): DbCollectionOpFunciton {
    return (c: DbCollection): Observable<Collection> => {
      let criteria = { username: username, name: collectionName };
      let query = c.find(criteria).limit(1);

      return Observable.fromPromise<Collection>(query.next());
    };
  }

  private saveCollection(newCollection: Collection): DbCollectionOpFunciton {
    return (c: DbCollection): Observable<Collection> => {
      let criteria = { username: newCollection.username, name: newCollection.name };
      let promise = c.findOneAndReplace(criteria, newCollection);
      return Observable.fromPromise(promise).map((op) => <Collection>op.value);
    };
  }
}
