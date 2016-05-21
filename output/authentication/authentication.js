"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
const core_1 = require('@angular/core');
const users_1 = require('../users');
const rxjs_1 = require('rxjs');
const jwt = require('jsonwebtoken');
const scrypt = require('scrypt');
var config = require('../../config');
const expires = 60 * 60 * 24;
let AuthenticationHandler = class AuthenticationHandler {
    constructor(userRepo) {
        this.userRepo = userRepo;
    }
    post(req, res, next) {
        let username = req.body.username, password = req.body.password;
        this.userRepo.get(username)
            .flatMap((user) => {
            return rxjs_1.Observable.create((subscriber) => {
                let validPass = new Buffer(user.password, 'base64');
                scrypt.verifyKdf(validPass, password, (err, result) => {
                    if (err) {
                        subscriber.error(err);
                    }
                    else {
                        subscriber.next(result);
                    }
                    subscriber.complete();
                });
            });
        })
            .subscribe((success) => {
            let tokenData = { username: username };
            let token = jwt.sign(tokenData, config.jwtSecret, { expiresIn: expires });
            res.send({
                token: token
            });
            next();
        }, next);
    }
};
AuthenticationHandler = __decorate([
    core_1.Injectable(), 
    __metadata('design:paramtypes', [users_1.UserRepository])
], AuthenticationHandler);
exports.AuthenticationHandler = AuthenticationHandler;
//# sourceMappingURL=authentication.js.map