"use strict";
function cardMatchPredicate(card) {
    return (otherCard) => {
        let sameName = otherCard.name === card.name;
        let sameSet = !card.set && !otherCard.set || card.set === otherCard.set;
        return sameName && sameSet;
    };
}
exports.cardMatchPredicate = cardMatchPredicate;
//# sourceMappingURL=card.helpers.js.map