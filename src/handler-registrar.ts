import * as bunyan from 'bunyan';
import {Server} from 'restify';
import {Injectable} from '@angular/core';

let log = bunyan.createLogger({ name: 'rune' });

@Injectable()
export class HandlerRegistrar {

  constructor(private server: Server) {
  }

  register = function(uri, methods) {
    Object.keys(methods).map((method) => {
      log.info({ method: method, path: uri }, 'Registering route')
      let callback = methods[method];
      this.server[method](uri, callback);
    });
  }
}
