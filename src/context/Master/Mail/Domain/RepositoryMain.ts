import { EntityMain } from './EntityMain';
import { Context } from 'hono';

export interface RepositoryMain {
  validateSendMail(params: EntityMain): Promise<void>;
  sendMail(c: Context, body: EntityMain, authUser: string): Promise<void>;
}
