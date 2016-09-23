import * as bunyan from 'bunyan';
import {Server} from 'restify';
import {Injectable} from '@angular/core';
import {IHandler} from './IHandler';

let log = bunyan.createLogger({ name: 'rune' });

@Injectable()
export class HandlerRegistrar {
  constructor(private server: Server) { }

  public register(uri: string , handler: IHandler) {
     if (handler.get) {
         console.log('register get', uri);
        this.server.get(uri, handler.get.bind(handler));
     }

     if (handler.post) {
        this.server.post(uri, handler.post.bind(handler));
     }
  }
}
