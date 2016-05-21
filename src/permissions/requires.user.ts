import {ForbiddenError} from 'restify';
import {ApiRequest} from '../util';

export function requireUser(req: ApiRequest, username: string) {
  if (req.user.username !== username) {
    throw new ForbiddenError();
  }
}
