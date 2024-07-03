import { Database } from "bun:sqlite";
import { PeriodRepository } from "@/models/repositories/period";
import { Period, periodSchema } from "@/models/period";

export class BunPeriodRepository implements PeriodRepository {
  private db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  async getPeriodById(id: string): Promise<Period | null> {
    try {
      const query = this.db.query(`SELECT * FROM period WHERE id = $id`);

      const result = await query.get({
        $id: id,
      });

      return periodSchema.parse(result);
    } catch (err) {
      console.error(err);
      return null;
    }
  }
}
