import { EntityMain } from '../Domain/EntityMain';
import { RepositoryMain } from '../Domain/RepositoryMain';
import { Context } from 'hono';

export class UseCaseSendMail {
  constructor(private repository: RepositoryMain) {}

  public async exec(c: Context, params: EntityMain, authUser: string): Promise<void> {
    try {
      await this.repository.validateSendMail(params);
      await this._exec(c, params, authUser);
    } catch (error) {
      throw error;
    }
  }

  async _exec(c: Context, params: EntityMain, authUser: string): Promise<void> {
    try {
      await this.repository.sendMail(c, params, authUser);
    } catch (error) {
      throw error;
    }
  }
}
