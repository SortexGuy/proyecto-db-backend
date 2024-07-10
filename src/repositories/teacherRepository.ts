import { Database } from "bun:sqlite";
import { TeacherRepository } from "@/models/repositories/teacher";
import { ExtCharge, extChargeSchema } from "@/models/charge";
import { teacherSchema, Teacher } from "@/models/teacher";
import { z } from "zod";

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

	async getTeacherAcademicChargesByTeacherId(id: string): Promise<ExtCharge[]> {
		try {
			const query = this.db.query(`
				SELECT period.start_date, period.end_date, course.name, course.year
					FROM charge
					INNER JOIN period ON charge.period_id = period.id
					INNER JOIN course ON charge.course_id = course.id
				WHERE teacher_id = $id;
			`);

			const result = await query.get({
				$id: id,
			});

			console.log(result);
			return extChargeSchema.array().parse(result);
		} catch (err) {
			console.error(err);
			return [];
		}
	}
}
