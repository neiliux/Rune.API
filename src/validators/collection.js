'use strict';

const validate = require('validate');
const schema = validate({
  name: {
    type: 'string',
    required: true,
    match: /^\w+$/,
    message: 'Collection name is required and must contain only a-z, 1-9, and _'
  },
  description: {
    type: 'string'
  }
});

module.exports = (obj) => {
  return schema.validate(obj);
};
