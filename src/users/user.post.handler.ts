/// <reference path="../custom-typings.d.ts" />
import {Injectable} from '@angular/core';
import {Request, Response, Next} from 'restify';
import {UserRepository} from '../users';
import {Observable} from 'rxjs';
import {IHandler} from '../IHandler';
import * as restify from 'restify';
import * as jwt from 'jsonwebtoken';
/* tslint:disable:no-require-imports */
/* tslint:disable:no-var-requires */
import scrypt = require('scrypt');
var config = require('../../config');
/* tslint:enable:no-var-requires */
/* tslint:enable:no-require-imports */

const expires = 60 * 60 * 24; // 24 hours

@Injectable()
export class UserPostHandler implements IHandler {
  constructor(private userRepo: UserRepository) {}

  post(req: Request, res: Response, next: Next) {
    //let username: string = req.body.username,
    //    password: string = req.body.password,
    //    email: string = req.body.email;
    
    //this.userRepo.create({ username: username, password: password, email: email })
    //    .subscribe(() => { res.send({created: true}) }, next, next);
    
    let user = req.body;

    //let errors = userValidator(user);
    //if (errors && errors.length) {
    //  return next(new restify.errors.BadRequestError(errors[0].message));
    //}

    console.log(user);

    scrypt.kdf(user.password, { N: 1, r: 1, p: 1 }, (err, result) => {
        console.log('cb 1');
        if (err) {
            throw new Error();
        }
        //err && subscriber.onError(err);
        user.password = result.toString('base64');
        //console.log(subscriber);
        //subscriber.onNext(user);
       // subscriber.onCompleted();

       this.userRepo.get(user.username)
        .subscribe((user) => {
            console.log('cb 2');
            if (user) {
                throw new Error();
            }

            console.log('cb 2.1');
            this.userRepo.create(user)
                .subscribe((savedUser) => {
                    console.log('cb 3');
                    res.send(savedUser);
                    next();
                }, (err) => { console.log(err); next() }, () => {});

        }, (err) => { console.log(err); next(); }, () => {});
    });

    //Observable.create((subscriber) => {
    //  scrypt.kdf(user.password, { N: 1, r: 1, p: 1 }, (err, result) => {
    //    err && subscriber.onError(err);
    //    user.password = result.toString('base64');
    //    console.log(subscriber);
    //    subscriber.onNext(user);
    //    subscriber.onCompleted();
   //   });
   // }).map(user => user.username)
   //   .flatMap(this.userRepo.get)
   //   .flatMap((data) => {
   //     if (data) {
   //       let msg = `The username "${user.username}" is not available`;
   //       //throw new restify.errors.ConflictError(msg);
    //        throw new Error();
    //    }
    //    return this.userRepo.create(user);
   //   })
  //    .subscribe((savedUser) => {
  //      res.send(savedUser);
  //      next();
  //    }, (err) => {
        //log.error(err);
  //      next(err);
//      });
 // }
  }
}
