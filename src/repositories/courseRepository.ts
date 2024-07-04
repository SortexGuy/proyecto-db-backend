import { Database } from "bun:sqlite";
import { CourseRepository } from "@/models/repositories/course";
import { Course, courseSchema } from "@/models/course";

export class BunCourseRepository implements CourseRepository {
	private db: Database;

	constructor(db: Database) {
		this.db = db;
	}

	async getCourseById(id: string): Promise<Course | null> {
		try {
			const query = this.db.query(`SELECT * FROM course WHERE id = $id`);

			const result = await query.get({
				$id: id,
			});

			return courseSchema.parse(result);
		} catch (err) {
			console.error(err);
			return null;
		}
	}
}
