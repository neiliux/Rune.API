/* tslint:disable:no-require-imports */
import validate = require('validate');
/* tslint:enable:no-require-imports */

export interface CardList extends Array<Card> {}

export class Card {
    name: string;
    multiverseId: string;
    set: string;
    quantity: number;
    printings: string[];
}

const SCHEMA = {
  name: {
    type: 'string',
    required: true
  },
  set: {
    type: 'string'
  },
  quantity: {
    type: 'number'
  }
};

export var CARD_SCHEMA = SCHEMA;


const cardValidator = validate(SCHEMA);

const cardsPropertyValidator = validate({
  cards: {
    required: true,
    type: 'array',
    each: obj => {
      return cardValidator.validate(obj).length === 0;
    },
    message: 'Cards required. Each card must have a name and quantity.'
  }
});

export function validateCardsProperty(obj: {cards: Array<Card>}): validate.ValidationError[] {
    return cardsPropertyValidator.validate(obj);
}

export function validateCard(card: Card): validate.ValidationError[] {
    return cardValidator.validate(card);
}
