import { Database } from "bun:sqlite";
import { UserRepository } from "@/models/repositories/user";
import { User, userSchema } from "@/models/user";

export class BunUserRepository implements UserRepository {
  private db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  async getUserById(id: string): Promise<User | null> {
    try {
      const query = this.db.query(`SELECT * FROM user WHERE id = $id`);

      const result = await query.get({
        $id: id,
      });

      return userSchema.parse(result);
    } catch (err) {
      console.error(err);
      return null;
    }
  }
}
