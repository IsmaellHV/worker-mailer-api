export class AdapterRetention {
  public static async purge(db: D1Database | undefined, tables: string[], days: number): Promise<void> {
    if (!db) return;
    for (const t of tables) {
      try {
        const res = await db
          .prepare(`DELETE FROM ${t} WHERE created_at < datetime('now', ?)`)
          .bind(`-${days} days`)
          .run();
        console.log(`retention ${t}: borradas ${res.meta?.changes ?? 0} filas (> ${days} días)`);
      } catch (e) {
        console.error(`retention ${t} failed:`, e);
      }
    }
  }
}
