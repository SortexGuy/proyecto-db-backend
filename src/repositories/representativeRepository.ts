import { Database } from "bun:sqlite";
import { Representative, representativeSchema } from "@/models/representative";
import { RepresentativeRepository } from "@/models/repositories/representative";

export class BunRepresentativeRepository implements RepresentativeRepository {
  private db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  async getRepresentativeByUserId(id: string): Promise<Representative | null> {
    try {
      const query = this.db.query(
        `SELECT * FROM representative WHERE user_id = $id`,
      );

      const result = await query.get({
        $id: id,
      });

      return representativeSchema.parse(result);
    } catch (err) {
      console.error(err);
      return null;
    }
  }
}
