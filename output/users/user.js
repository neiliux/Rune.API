"use strict";
const validator = require('validator');
const validate = require('validate');
class User {
}
exports.User = User;
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
function userValidator(user) {
    return userValidatorFn.validate(user);
}
exports.userValidator = userValidator;
;
exports.USER_SCHEMA = SCHEMA;
//# sourceMappingURL=user.js.map