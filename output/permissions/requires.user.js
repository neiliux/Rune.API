"use strict";
const restify_1 = require('restify');
function requireUser(req, username) {
    if (req.user.username !== username) {
        throw new restify_1.ForbiddenError();
    }
}
exports.requireUser = requireUser;
//# sourceMappingURL=requires.user.js.map