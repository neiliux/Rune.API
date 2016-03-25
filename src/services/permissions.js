'use strict';

const restify = require('restify');

module.exports = {
  requireUser: (req, username) => {
    if (req.user.username !== username) {
      throw new restify.errors.ForbiddenError();
    }
  }
}
