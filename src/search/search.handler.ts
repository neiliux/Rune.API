import {Card} from '../cards/card';
import {Request, Response, Next, NotFoundError} from 'restify';
import {IHandler} from '../IHandler';

let lodash = require('lodash');

// TODO: Move to file.
export class SearchFilter {
    name: string;
}

export class SearchHandler implements IHandler {
    constructor(private _mtgJson: any) { }

    public get(req: Request, res: Response, next: Next): void {
        let matchingCards: Array<Card> = [];
        let filter: SearchFilter = this.buildFilter(req);

        lodash.each(this._mtgJson, function(set) {
          lodash.each(set.cards, function(card) {
            let regEx = new RegExp(filter.name, 'i');
            if (regEx.test(card.name)) {
              matchingCards.push(card);
            }
          });
        });

        console.log('search found', matchingCards.length, 'cards');
        res.send(matchingCards);
        next();
    }

    private buildFilter(request: Request): SearchFilter {
        let filter: SearchFilter = new SearchFilter();
        filter.name = request.query['name'];
        return filter;
    }
}

