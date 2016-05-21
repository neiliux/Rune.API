import * as validator from 'validator';
/* tslint:disable:no-require-imports */
import validate = require('validate');
/* tslint:enable:no-require-imports */

export class User {
  username: string;
  email: string;
  password: string;
}

const SCHEMA = {
  username: {
    type: 'string',
    required: true,
    match: /^\w{3,}$/,
    message: 'Username may contain only alphanumeric characters and underscores, and must be at least three characters long.'
  },
  email: {
    type: 'string',
    required: true,
    use: validator.isEmail,
    message: 'Invalid email address'
  },
  password: {
    type: 'string',
    required: true,
    match: /^.{15,}$/,
    message: 'Passwords must be at least 15 characters long'
  }
};

const userValidatorFn = validate(SCHEMA);

export function userValidator(user: User) {
  return userValidatorFn.validate(user);
};


export var USER_SCHEMA = SCHEMA;
