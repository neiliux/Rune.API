"use strict";
const card_1 = require('./card');
const validate = require('validate');
const schema = validate(card_1.cardSchema);
const cardsSchema = validate({
    cards: {
        required: true,
        type: 'array',
        each: obj => {
            return schema.validate(obj).length === 0;
        },
        message: 'Cards required. Each card must have a name and quantity.'
    }
});
function validateCards(obj) {
    return cardsSchema.validate(obj);
}
exports.validateCards = validateCards;
//# sourceMappingURL=card.validator.js.map