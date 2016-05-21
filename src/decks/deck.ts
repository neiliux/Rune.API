import {Card, validateCard} from '../cards';
/* tslint:disable:no-require-imports */
import validate = require('validate');
/* tslint:enable:no-require-imports */

export class Deck {
  username: string;
  name: string;
  description: string;
  cards: Array<Card>;
}

const DECK_SCHEMA = {
  name: {
    type: 'string',
    required: true,
    match: /^\w+$/,
    message: 'Deck name is required and must contain only a-z, 1-9, and _'
  },
  description: {
    type: 'string',
    match: /^.{0,255}$/,
    message: 'Deck description must be less than 256 characters.'
  },
  cards: {
    type: 'array',
    each: validateCard
  }
};

const validator = validate(DECK_SCHEMA);

export function deckValidator(deck: Deck): validate.ValidationError[] {
  return validator.validate(deck);
}
