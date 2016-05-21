"use strict";
const user_1 = require('./user');
const validate = require('validate');
const userValidatorFn = validate(user_1.userSchema);
function userValidator(user) {
    return userValidatorFn.validate(user);
}
exports.userValidator = userValidator;
;
//# sourceMappingURL=user.validator.js.map