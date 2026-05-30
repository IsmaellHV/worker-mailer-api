export interface TemplateParams {
  body: string;
  year: number;
}

export interface BrandOptions {
  brand: string; // texto/nombre que aparece en el encabezado y footer
  accentColor: string; // color de la barra superior y acentos
}

// Plantilla base responsive. Workers no tiene fs/path, por eso va incrustada como string.
// Las plantillas por caso (ihv/sci/sisci) solo cambian marca y color.
export const baseTemplate = ({ body, year }: TemplateParams, brand: BrandOptions): string => `<!DOCTYPE html>
<html lang="es" xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title></title>
  </head>
  <body style="margin:0;padding:0;min-width:100%;background-color:#f2f4f7;font-family:Arial,Helvetica,sans-serif;">
    <center style="width:100%;background-color:#f2f4f7;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f2f4f7;">
        <tr>
          <td align="center" style="padding:24px 12px;">
            <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;background-color:#ffffff;border-radius:10px;overflow:hidden;">
              <tr>
                <td style="height:6px;background-color:${brand.accentColor};"></td>
              </tr>
              <tr>
                <td style="padding:24px 32px 4px 32px;color:${brand.accentColor};font-size:18px;font-weight:bold;letter-spacing:0.5px;">
                  ${brand.brand}
                </td>
              </tr>
              <tr>
                <td style="padding:8px 32px 8px 32px;color:#1f2937;font-size:14px;line-height:1.6;">
                  ${body}
                </td>
              </tr>
              <tr>
                <td style="padding:16px 32px 28px 32px;">
                  <p style="margin:0;color:#9ca3af;font-size:11px;line-height:1.5;text-align:justify;">
                    Este mensaje y el material adjunto pueden contener informaci&oacute;n confidencial de uso exclusivo del destinatario. Si usted no es el destinatario indicado, queda notificado de que la lectura, copia o divulgaci&oacute;n est&aacute; prohibida; por favor notifique al remitente y elimine este mensaje.
                  </p>
                </td>
              </tr>
              <tr>
                <td align="center" style="padding:16px;background-color:#111827;color:#ffffff;font-size:12px;">
                  <span>&copy; ${year} ${brand.brand} &mdash; Todos los derechos reservados</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </center>
  </body>
</html>`;
