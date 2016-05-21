"use strict";
const restify_1 = require('restify');
class CardHandler {
    constructor(cardRepo, setRepo) {
        this.cardRepo = cardRepo;
        this.setRepo = setRepo;
    }
    get(req, res, next) {
        let cardName = req.params['id'], set = req.query['set'];
        let cardSource = set
            ? this.setRepo.getCard(set, cardName)
            : this.cardRepo.get(cardName);
        return cardSource
            .do(card => {
            if (!card) {
                throw new restify_1.NotFoundError();
            }
        })
            .subscribe(data => res.send(data), next, next);
    }
}
exports.CardHandler = CardHandler;
;
//# sourceMappingURL=card.handler.js.map