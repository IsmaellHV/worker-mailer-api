import type { Context } from 'hono';

export type Bindings = {
  PREFIX: string;
  DOMAINS: string;
  ALLOWED_IPS: string;
  AUTH_BASIC: string;
  USERS: string;
  RESEND_API_TOKEN: string;
  RESEND_FROM: string;
  DB_LOG: D1Database;
};

export interface IAuthBasic {
  usr: string;
  pwd: string;
}

export interface IUserMail {
  user: string; // debe coincidir con el usuario de AUTH_BASIC
  from: string; // remitente con display name, ej. "SCI <sci@ihurtadov.com>"
  template: string; // clave de plantilla: 'ihv' | 'sci' | 'sisci'
}

export const getEnvironment = (c: Context<{ Bindings: Bindings }>) => ({
  PREFIX: c.env.PREFIX || '',
  DOMAINS: c.env.DOMAINS ? JSON.parse(c.env.DOMAINS) : [],
  ALLOWED_IPS: (c.env.ALLOWED_IPS ? JSON.parse(c.env.ALLOWED_IPS) : []) as string[],
  AUTH_BASIC: (c.env.AUTH_BASIC ? JSON.parse(c.env.AUTH_BASIC) : []) as IAuthBasic[],
  USERS: (c.env.USERS ? JSON.parse(c.env.USERS) : []) as IUserMail[],
  RESEND: {
    API_KEY: c.env.RESEND_API_TOKEN || '',
    FROM: c.env.RESEND_FROM || '',
  },
});
