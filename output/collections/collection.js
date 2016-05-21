"use strict";
const validate = require('validate');
class Collection {
}
exports.Collection = Collection;
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
function collectionValidator(collection) {
    return validator.validate(collection);
}
exports.collectionValidator = collectionValidator;
//# sourceMappingURL=collection.js.map