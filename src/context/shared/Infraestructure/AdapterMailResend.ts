import { Resend } from 'resend';
import { IError } from '../../../types/IError';

export interface IMailResendSend {
  apiKey: string;
  from: string;
  subject: string;
  html: string;
  text?: string;
  to: string[];
  cc?: string[];
  bcc?: string[];
  attachments?: { filename: string; content: string }[];
}

export class AdapterMailResend {
  public static async sendMessage(params: IMailResendSend): Promise<void> {
    const resend = new Resend(params.apiKey);

    const { error } = await resend.emails.send({
      from: params.from,
      to: params.to,
      cc: params.cc,
      bcc: params.bcc,
      subject: params.subject,
      html: params.html,
      text: params.text,
      attachments: params.attachments,
    });

    if (error) throw new IError(error.message, 0, 406, 'Se produjo un error al enviar el correo electrónico. Por favor, inténtelo de nuevo más tarde');
  }
}
