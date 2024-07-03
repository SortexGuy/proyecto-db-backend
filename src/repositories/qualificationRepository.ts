import { Database } from "bun:sqlite";
import { QualificationRepository } from "@/models/repositories/qualification";
import { Qualification, qualificationSchema } from "@/models/qualification";

export class BunQualificationRepository implements QualificationRepository {
  private db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  async getQualificationById(id: string): Promise<Qualification | null> {
    try {
      const query = this.db.query(`SELECT * FROM qualification WHERE id = $id`);

      const result = await query.get({
        $id: id,
      });

      return qualificationSchema.parse(result);
    } catch (err) {
      console.error(err);
      return null;
    }
  }
}
