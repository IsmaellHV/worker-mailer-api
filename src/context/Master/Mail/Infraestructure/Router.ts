import { AdapterConfigure } from './AdapterConfigure';
import { Controller } from './Controller';
import { EntityMain } from '../Domain/EntityMain';
import { IError } from '../../../../types/IError';
import { Hono, Context } from 'hono';
import { ContentfulStatusCode } from 'hono/utils/http-status';
import { AdapterAuthorization } from '../../../shared/Infraestructure/AdapterAuthorization';

export class Router {
  private controller: Controller;
  public router: Hono;

  constructor() {
    this.router = new Hono();
    this.controller = new Controller();
  }

  public async exec(): Promise<void> {
    this.router.post(`/${AdapterConfigure.SCHEMA}/${AdapterConfigure.ENTITY}/sendMail`, this.sendMail.bind(this));
  }

  private async sendMail(c: Context): Promise<Response> {
    try {
      await AdapterAuthorization.validateAuthBasic(c);

      const body: EntityMain = await c.req.json();
      await this.controller.sendMail(c, body);
      return c.json(true, 200);
    } catch (error) {
      const err = error as IError;
      return c.json(
        { error: true, errorDescription: err.messageClient || err.message, errorCode: err.errorCode ?? 0, message: err.message },
        (err.statusHttp ?? 406) as ContentfulStatusCode,
      );
    }
  }
}
