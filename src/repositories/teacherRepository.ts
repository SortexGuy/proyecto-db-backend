import { Database } from "bun:sqlite";
import { TeacherRepository } from "@/models/repositories/teacher";
import { teacherSchema, Teacher } from "@/models/teacher";

export class BunTeacherRepository implements TeacherRepository {
  private db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  async getTeacherByUserId(id: string): Promise<Teacher | null> {
    try {
      const query = this.db.query(`SELECT * FROM teacher WHERE user_id = $id`);

      const result = await query.get({
        $id: id,
      });

      console.log(result);
      return teacherSchema.parse(result);
    } catch (err) {
      console.error(err);
      return null;
    }
  }
}
