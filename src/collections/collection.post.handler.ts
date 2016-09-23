import {Collection} from './collection';
import {CollectionRepository} from './collection.repo';
import {requireUser} from '../permissions';
import {ApiRequest} from '../util';
import {Observable} from 'rxjs';
import {BadRequestError, ConflictError, Next, NotFoundError, Request, Response} from 'restify';
import {collectionValidator} from './collection';
import {IHandler} from '../IHandler';

export class CollectionPostHandler implements IHandler {
  constructor(private collectionRepo: CollectionRepository) {}

  post(req: ApiRequest, res: Response, next: Next) {
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
}
