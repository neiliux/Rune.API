import {Card} from '../cards';
/* tslint:disable:no-require-imports */
import validate = require('validate');
/* tslint:enable:no-require-imports */

export class Collection {
  username: string;
  name: string;
  cards: Array<Card>;
}

const COLLECTION_SCHEMA = {
  name: {
    type: 'string',
    required: true,
    match: /^\w+$/,
    message: 'Collection name is required and must contain only a-z, 1-9, and _'
  },
  description: {
    type: 'string'
  }
};

const validator = validate(COLLECTION_SCHEMA);

export function collectionValidator(collection: Collection): validate.ValidationError[] {
  return validator.validate(collection);
}
