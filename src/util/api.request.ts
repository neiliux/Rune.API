import {User} from '../users';
import {Request} from 'restify';

export interface ApiRequest extends Request {
  user?: User;
}
