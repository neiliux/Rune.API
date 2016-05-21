"use strict";
const validator = require('validator');
const schema = require('validate');
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
        match: /^.{15,}$/,
        message: 'Passwords must be at least 15 characters long'
    }
});
exports.userValidator = userSchema;
//# sourceMappingURL=validator.js.map