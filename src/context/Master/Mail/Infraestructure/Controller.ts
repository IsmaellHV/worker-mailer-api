import { Context } from 'hono';
import { UseCaseSendMail } from '../Application/UseCaseSendMail';
import { EntityMain } from '../Domain/EntityMain';
import { RepositoryMainImpl } from './RepositoryMainImpl';

export class Controller {
  private repo: RepositoryMainImpl;

  constructor() {
    this.repo = new RepositoryMainImpl();
  }

  public async sendMail(c: Context, params: EntityMain, authUser: string): Promise<void> {
    await new UseCaseSendMail(this.repo).exec(c, params, authUser);
  }
}
