/// <reference path="../custom-typings.d.ts" />
import {Injectable} from '@angular/core';
import {Request, Response, Next} from 'restify';
import {UserRepository} from '../users';
import {Observable} from 'rxjs';
import {IHandler} from '../IHandler';

import * as jwt from 'jsonwebtoken';
/* tslint:disable:no-require-imports */
/* tslint:disable:no-var-requires */
import scrypt = require('scrypt');
var config = require('../../config');
/* tslint:enable:no-var-requires */
/* tslint:enable:no-require-imports */

const expires = 60 * 60 * 24; // 24 hours

@Injectable()
export class AuthenticationHandler implements IHandler {
  constructor(private userRepo: UserRepository) {}

  post(req: Request, res: Response, next: Next) {
    let username: string = req.body.username,
      password: string = req.body.password;

    this.userRepo.get(username)
      .flatMap((user) => {
        return Observable.create((subscriber) => {
          let validPass = new Buffer(user.password, 'base64');
          scrypt.verifyKdf(validPass, password, (err, result) => {
            if (err) {
              subscriber.error(err);
            } else {
              subscriber.next(result);
            }
            subscriber.complete();
          });
        });
      })
      .subscribe(
        (success) => {
          let tokenData = { username: username };
          let token = jwt.sign(tokenData, config.jwtSecret, { expiresIn: expires });
          res.send({
            token: token
          });
          next();
        }, next);
  }
}
