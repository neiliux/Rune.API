import {Collection} from './collection';
import {CollectionRepository} from './collection.repo';
import {Card, CardList, CardRepository, cardMatchPredicate, validateCardsProperty} from '../cards';
import {requireUser} from '../permissions';
import {ApiRequest} from '../util';
import {Observable} from 'rxjs';
import {BadRequestError, ConflictError, Next, NotFoundError, Request, Response} from 'restify';
import {collectionValidator} from './collection';

export class CollectionHandler {

  constructor(private collectionRepo: CollectionRepository, private cardRepo: CardRepository) {}

  get(req: Request, res: Response, next: Next) {
    let userId: string = req.params['userId'];
    this.getCollection(userId, req.params['collectionId'])
      .subscribe(res.send.bind(res), next, next);
  }

  // update - patch
  update(req: Request, res: Response, next: Next) {
    // Validate request format
    let errors = validateCardsProperty(req.body);
    if (errors && errors.length) {
      return next(errors[0]);
    }

    let userId: string = req.params['userId'];
    let collectionId: string = req.params['collectionId'];

    requireUser(req, userId);

    let cards: CardList = req.body;

    // Validate cards & sets
    let cardNames: string[] = cards.map((c: Card) => c.name);
    let validCardSource: Observable<CardList> = this.cardRepo.bulkFind(cardNames);
    let incomingCardSource: Observable<Card> = Observable.from<Card>(req.body.cards);
    let collectionSource: Observable<Collection> = this.collectionRepo.get(userId, collectionId);

    let validationSource: Observable<Card> = Observable.combineLatest(validCardSource, incomingCardSource)
      .map(([dbCards, reqCard]: [CardList, Card]) => {

        let valid: boolean = dbCards.some(dbCard => {
          return dbCard.name === reqCard.name && (!reqCard.set || dbCard.printings.indexOf(reqCard.set) >= 0);
        });

        if (!valid) {
          throw new NotFoundError(`Card "${reqCard.name}" not found (in set ${reqCard.set})`);
        }

        return reqCard;
      });

      Observable.combineLatest(collectionSource, validationSource)
        .reduce((acc: Collection, [collection, updatedCard]: [Collection, Card]): Collection => {
          //let collection = collectionPair[0],
          //  updatedCard = collectionPair[1];

          if (updatedCard.quantity === 0) {
            this.removeAllFromCollection(collection, updatedCard);
          } else {
            this.upsertCard(collection, updatedCard);
          }

          return collection;
        }, null)
        .flatMap(this.collectionRepo.save)
        .subscribe(data => res.send(200), next, next);
  }

  // create - post
  create(req: ApiRequest, res: Response, next: Next) {
    let collection: Collection = req.body;
    let username: string = req.user.username;
    let errors = collectionValidator(collection);

    if (errors && errors.length) {
      let msg = errors[0].message;
      return next(new BadRequestError(msg));
    }

    collection.username = username;

    this.collectionRepo
      .get(username, collection.name)
      .do(doc => {
        if (doc) {
          let msg = `user ${username} already has a collection named ${collection.name}`;
          throw new ConflictError(msg);
        }
      })
      .flatMap((c: Collection) => this.collectionRepo.create(collection))
      .subscribe(data => res.send(data), next, next);
  }
  private getCollection(username: string, collectionId: string): Observable<Collection> {
    return this.collectionRepo
      .get(username, collectionId)
      .do(doc => {
        if (!doc) {
          throw new NotFoundError();
        }
      });
  }

  private upsertCard(collection: Collection, card: Card) {
    if (!card.set) {
      throw new Error('upsert card: Card must have set defined');
      // used to be: !card.set && !colCard.set || card.set === colCard.set
    }
    let collectionEntry = collection.cards.find(cardMatchPredicate(card));

    if (collectionEntry) {
      collectionEntry.quantity = card.quantity;
    } else {
      if (!collection.cards) {
        collection.cards = [];
      }
      collection.cards.push(card);
    }
  }

  private removeAllFromCollection(collection: Collection, card: Card) {
    let idx = collection.cards.findIndex(cardMatchPredicate(card));
    collection.cards.splice(idx, 1);
  }
}
