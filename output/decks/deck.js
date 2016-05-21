"use strict";
const cards_1 = require('../cards');
const validate = require('validate');
class Deck {
}
exports.Deck = Deck;
const DECK_SCHEMA = {
    name: {
        type: 'string',
        required: true,
        match: /^\w+$/,
        message: 'Deck name is required and must contain only a-z, 1-9, and _'
    },
    description: {
        type: 'string',
        match: /^.{0,255}$/,
        message: 'Deck description must be less than 256 characters.'
    },
    cards: {
        type: 'array',
        each: cards_1.validateCard
    }
};
const validator = validate(DECK_SCHEMA);
function deckValidator(deck) {
    return validator.validate(deck);
}
exports.deckValidator = deckValidator;
//# sourceMappingURL=deck.js.map