import {CardRepository} from './card.repo';
import {SetRepository} from '../sets';
import {Request, Response, Next, NotFoundError} from 'restify';

export class CardHandler {
  constructor(private cardRepo: CardRepository, private setRepo: SetRepository) { }
  
  get(req: Request, res: Response, next: Next) {
    let cardName = req.query['name'],
        set = req.query['set'];

    let cardSource = set
      ? this.setRepo.getCard(set, cardName)
      : this.cardRepo.get(cardName);

    return cardSource
      .do(card => {
        if (!card) {
          throw new NotFoundError();
        }
      })
      .subscribe(data => res.send(data), next, next);
  }
};
