'use strict';

import {SetRepository} from './set.repo';
import {Next, NotFoundError, Response, Request} from 'restify';


export class SetHandlers {
  constructor(private setRepo: SetRepository) {
  }

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

  browse(req: Request, res: Response, next: Next) {
    this.setRepo.get().subscribe(data => res.send(data), next, next);
  }
}
