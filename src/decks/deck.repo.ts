'use strict';
import {Deck} from './deck';
import {MongoClient, DbCollection} from '../clients';
import {Observable} from 'rxjs';

const DECK_COLLECTION = 'decks';

interface DbCollectionOpFunciton { (c: DbCollection): Observable<Deck>; }
export class DeckRepository {
  constructor(private client: MongoClient) {
  }

  get(username: string, deckName: string): Observable<Deck> {
    return this.getDbCollection().flatMap(this.getDeck(username, deckName));
  }

  create(deck): Observable<Deck> {
    return this.getDbCollection().flatMap(this.createDeck(deck));
  }

  save(deck: Deck): Observable<Deck> {
    return this.getDbCollection().flatMap(this.saveDeck(deck));
  }

  private getDbCollection(): Observable<DbCollection> {
    return this.client.connect(DECK_COLLECTION);
  }

  private createDeck(deck: Deck): DbCollectionOpFunciton {
    return (c: DbCollection): Observable<Collection> => {
      return Observable.fromPromise(c.insertOne(collection)).map((op) => {
        return op.result.ok > 0 ? collection : null;
      });
    };
  }

  private getDeck(username: string, deckName: string): DbCollectionOpFunciton {
    return (c: DbCollection): Observable<Deck> => {
      let criteria = { username: username, name: deckName };
      let query = c.find(criteria).limit(1);

      return Observable.fromPromise<Deck>(query.next());
    };
  }

  private saveDeck(newDeck: Deck): DbCollectionOpFunciton {
    return (c: DbCollection): Observable<Deck> => {
      let criteria = { username: newDeck.username, name: newDeck.name };
      let promise = c.findOneAndReplace(criteria, newDeck);
      return Observable.fromPromise(promise).map((op) => <Deck>op.value);
    };
  }
}
