import {Collection} from './collection';
import {CollectionRepository} from './collection.repo';
import {requireUser} from '../permissions';
import {ApiRequest} from '../util';
import {Observable} from 'rxjs';
import {BadRequestError, ConflictError, Next, NotFoundError, Request, Response} from 'restify';
import {collectionValidator} from './collection';
import {IHandler} from '../IHandler';

export class CollectionGetHandler implements IHandler {
  constructor(private collectionRepo: CollectionRepository) {}

  get(req: Request, res: Response, next: Next) {
    let userId: string = req.params['userId'];
    this.getCollection(userId, req.params['collectionId'])
      .subscribe(res.send.bind(res), next, next);
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
}
