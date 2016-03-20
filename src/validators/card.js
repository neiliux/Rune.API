'use strict';

const validate = require('validate');

const cardSchema = validate({
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
});

const schema = validate({
  cards: {
    required: true,
    type: 'array',
    each: obj => {
      return cardSchema.validate(obj).length === 0
    },
    message: 'Cards required. Each card must have a name and quantity.'
  }
});

module.exports = obj => {
  return schema.validate(obj);
};
