import { Context } from 'hono';
import { IError } from '../../../../types/IError';
import { AdapterMailClient } from '../../../shared/Infraestructure/AdapterMailClient';
import { AdapterMailLog } from '../../../shared/Infraestructure/AdapterMailLog';
import { EntityMain } from '../Domain/EntityMain';
import { RepositoryMain } from '../Domain/RepositoryMain';
import { Bindings, getEnvironment } from '../../../../env';

export class RepositoryMainImpl implements RepositoryMain {
  public async validateSendMail(params: EntityMain): Promise<void> {
    if (!this.isNonEmptyString(params.subject)) {
      throw new IError('parámetros de ingreso no presenta la propiedad subject', 0);
    }
    if (!this.isNonEmptyString(params.cuerpo)) {
      throw new IError('parámetros de ingreso no presenta la propiedad cuerpo', 0);
    }

    const recipients = [params.to, params.cc, params.bcc];
    if (!recipients.some((r) => this.toArray(r).length > 0)) {
      throw new IError('parámetros de ingreso debe incluir al menos un destinatario en to, cc o bcc', 0);
    }

    for (const [field, value] of [['to', params.to], ['cc', params.cc], ['bcc', params.bcc]] as const) {
      for (const email of this.toArray(value)) {
        if (!this.isEmail(email)) {
          throw new IError(`parámetro de ingreso: ${field} contiene un correo no válido (${email})`, 0);
        }
      }
    }
  }

  public async sendMail(c: Context, params: EntityMain, authUser: string): Promise<void> {
    const ENVIRONMENT = getEnvironment(c);
    const db = (c.env as Bindings).DB_LOG;
    const origin = c.req.header('origin') || c.req.header('host') || null;
    const base = {
      to: this.join(params.to),
      cc: this.join(params.cc),
      bcc: this.join(params.bcc),
      subject: params.subject,
      origin,
    };

    // El remitente (from) y la plantilla se determinan por el usuario autenticado (Basic), no por el body.
    const cred = ENVIRONMENT.USERS.find((u) => u.user === authUser);
    const from = cred?.from || ENVIRONMENT.RESEND.FROM;
    const template = cred?.template;

    try {
      await AdapterMailClient.sendMessage({ apiKey: ENVIRONMENT.RESEND.API_KEY, from, template }, params);
      await AdapterMailLog.save(db, { ...base, status: 'sent' });
    } catch (err) {
      await AdapterMailLog.save(db, { ...base, status: 'failed', error: (err as Error)?.message ?? 'unknown' });
      throw err;
    }
  }

  private join(value: string[] | string | null | undefined): string | null {
    const arr = this.toArray(value);
    return arr.length ? arr.join(', ') : null;
  }

  private isNonEmptyString(value: unknown): value is string {
    return typeof value === 'string' && value.trim().length > 0;
  }

  private isEmail(value: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  private toArray(value: string[] | string | null | undefined): string[] {
    if (!value) return [];
    return Array.isArray(value) ? value : [value];
  }
}
