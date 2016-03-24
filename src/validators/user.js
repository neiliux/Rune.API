'use strict';

const schema = require('validate'),
  validator = require('validator');

const userSchema = schema({
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
    match: /^.{8,}$/,
    message: 'Passwords must be at least 8 characters long'
  }
});

module.exports = (user) => {
  return userSchema.validate(user);
};
