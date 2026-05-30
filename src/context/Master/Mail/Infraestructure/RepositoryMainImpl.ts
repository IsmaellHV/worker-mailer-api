import { Context } from 'hono';
import { IError } from '../../../../types/IError';
import { AdapterMailClient } from '../../../shared/Infraestructure/AdapterMailClient';
import { EntityMain } from '../Domain/EntityMain';
import { RepositoryMain } from '../Domain/RepositoryMain';
import { getEnvironment } from '../../../../env';

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

  public async sendMail(c: Context, params: EntityMain): Promise<void> {
    const ENVIRONMENT = getEnvironment(c);
    await AdapterMailClient.sendMessage({ apiKey: ENVIRONMENT.RESEND.API_KEY, from: ENVIRONMENT.RESEND.FROM }, params);
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
