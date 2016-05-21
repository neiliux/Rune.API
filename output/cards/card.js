"use strict";
const validate = require('validate');
class Card {
}
exports.Card = Card;
const SCHEMA = {
    name: {
        type: 'string',
        required: true
    },
    set: {
        type: 'string'
    },
    quantity: {
        type: 'number'
    }
};
exports.CARD_SCHEMA = SCHEMA;
const cardValidator = validate(SCHEMA);
const cardsPropertyValidator = validate({
    cards: {
        required: true,
        type: 'array',
        each: obj => {
            return cardValidator.validate(obj).length === 0;
        },
        message: 'Cards required. Each card must have a name and quantity.'
    }
});
function validateCardsProperty(obj) {
    return cardsPropertyValidator.validate(obj);
}
exports.validateCardsProperty = validateCardsProperty;
function validateCard(card) {
    return cardValidator.validate(card);
}
exports.validateCard = validateCard;
//# sourceMappingURL=card.js.map