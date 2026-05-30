export interface IMailLogRow {
  to: string | null;
  cc: string | null;
  bcc: string | null;
  subject: string | null;
  status: 'sent' | 'failed';
  error?: string | null;
  origin?: string | null;
}

export class AdapterMailLog {
  public static async save(db: D1Database | undefined, row: IMailLogRow): Promise<void> {
    if (!db) return;
    try {
      await db
        .prepare('INSERT INTO mail_log (to_addr, cc_addr, bcc_addr, subject, status, error, origin) VALUES (?, ?, ?, ?, ?, ?, ?)')
        .bind(row.to, row.cc, row.bcc, row.subject, row.status, row.error ?? null, row.origin ?? null)
        .run();
    } catch (e) {
      console.error('mail_log save failed:', e);
    }
  }
}
