import {SetRepository} from './set.repo';
import {Next, NotFoundError, Response, Request} from 'restify';
import {IHandler} from '../IHandler';

export class SetCodeHandlers implements IHandler {
  constructor(private setRepo: SetRepository) { }

  get(req: Request, res: Response, next: Next) {
    let setId = req.params['id'];
    this.setRepo.get(setId)
      .do(set => {
        if (!set) {
          throw new NotFoundError();
        }
      })
      .subscribe(data => res.send(data), next, next);
  }
}
