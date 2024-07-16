import { Database } from "bun:sqlite";
import { CourseRepository } from "@/models/repositories/course";
import { Course, NewCourse, courseSchema } from "@/models/course";
import { HTTPException } from "hono/http-exception";

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

	async getAllCourses(): Promise<Course[]> {
		try {
			const query = this.db.query(`SELECT * FROM course`);

			const result = query.all();

			return result.map((course) => courseSchema.parse(course));
		} catch (err) {
			console.error(err);
			return [];
		}
	}

	createCourse(course: NewCourse): void {
		try {
			const query = this.db.query(`INSERT INTO course (name, year)
					VALUES ($name, $year)`);

			query.run({
				$name: course.name,
				$year: course.year,
			});
		} catch (err) {
			console.error(err);
			throw new HTTPException(500, { message: "Internal Server Error" });
		}
	}
}
