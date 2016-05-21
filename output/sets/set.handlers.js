'use strict';
const restify_1 = require('restify');
class SetHandlers {
    constructor(setRepo) {
        this.setRepo = setRepo;
    }
    get(req, res, next) {
        let setId = req.params['id'];
        this.setRepo.get(setId)
            .do(set => {
            if (!set) {
                throw new restify_1.NotFoundError();
            }
        })
            .subscribe(data => res.send(data), next, next);
    }
    browse(req, res, next) {
        this.setRepo.get().subscribe(data => res.send(data), next, next);
    }
}
exports.SetHandlers = SetHandlers;
//# sourceMappingURL=set.handlers.js.map