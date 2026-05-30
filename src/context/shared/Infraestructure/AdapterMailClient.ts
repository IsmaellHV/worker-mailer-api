import { IError } from '../../../types/IError';
import { getTemplate } from './templates';
import { AdapterMailResend, IMailResendSend } from './AdapterMailResend';

export interface IMailClientConfig {
  apiKey: string;
  from: string;
  template?: string | null; // clave de plantilla: 'ihv' | 'sci' | 'sisci'
}

export interface IMailClientMessage {
  subject: string | null;
  cuerpo: string | null;
  saludo?: string | null;
  name?: string | null;
  to?: string[] | string | null;
  cc?: string[] | string | null;
  bcc?: string[] | string | null;
  attachment?: { filename: string; base64: string; cid?: string }[] | null;
}

export class AdapterMailClient {
  public static async sendMessage(config: IMailClientConfig, params: IMailClientMessage): Promise<void> {
    if (!config.apiKey || !config.from) {
      throw new IError('Configuración de correo incompleta (RESEND_API_TOKEN / RESEND_FROM)', 0, 406, 'Servicio de correo no configurado');
    }

    const innerBody = [params.saludo, params.cuerpo].filter((x) => !!x).join('<br /><br />');
    const html = getTemplate(config.template)({ body: innerBody, year: new Date().getFullYear() });
    const text = this.htmlToText([params.saludo, params.cuerpo].filter((x) => !!x).join('\n\n'));

    const from = params.name && !config.from.includes('<') ? `${params.name} <${config.from}>` : config.from;

    const entity: IMailResendSend = {
      apiKey: config.apiKey,
      from,
      subject: params.subject || '',
      html,
      text,
      to: this.toArray(params.to),
      cc: this.toArray(params.cc),
      bcc: this.toArray(params.bcc),
      attachments: params.attachment?.map((a) => ({ filename: a.filename, content: a.base64 })),
    };

    await AdapterMailResend.sendMessage(entity);
  }

  private static toArray(value: string[] | string | null | undefined): string[] {
    if (!value) return [];
    return Array.isArray(value) ? value : [value];
  }

  // Versión texto plano: <br>/</p> → saltos de línea, quita el resto de etiquetas y decodifica entidades básicas.
  private static htmlToText(html: string): string {
    return html
      .replace(/<\s*br\s*\/?>/gi, '\n')
      .replace(/<\/\s*(p|div|h[1-6])\s*>/gi, '\n\n')
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/gi, ' ')
      .replace(/&amp;/gi, '&')
      .replace(/&lt;/gi, '<')
      .replace(/&gt;/gi, '>')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }
}
