import { Database } from "bun:sqlite";
import { TeacherRepository } from "@/models/repositories/teacher";
import { ExtCharge, chargeSchema, extChargeSchema } from "@/models/charge";
import { teacherSchema, Teacher } from "@/models/teacher";
import { z } from "zod";
import { HTTPException } from "hono/http-exception";

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

	async getAllTeachers(): Promise<Teacher[]> {
		try {
			const query = this.db.query(`SELECT * FROM teacher`);

			const result = query.all();

			return teacherSchema.array().parse(result);
		} catch (err) {
			console.error(err);
			return [];
		}
	}

	async getTeacherAcademicChargesByTeacherId(id: string): Promise<ExtCharge[]> {
		try {
			const query = this.db.query(`
				SELECT charge.section,
				  period.start_date, period.end_date,
				  course.name AS course_name, course.year AS course_year
				FROM charge
					INNER JOIN period ON charge.period_id = period.id
					INNER JOIN course ON charge.course_id = course.id
				WHERE teacher_id = $id;
			`);

			const result = query.all({
				$id: id,
			});

			console.log(result);
			return extChargeSchema.array().parse(result);
		} catch (err) {
			console.error(err);
			return [];
		}
	}

	asignNewCharge(charge: any): void {
		try {
			const chargeData = chargeSchema.omit({ id: true }).parse(charge);

			const query = this.db
				.query(`INSERT INTO charge (section, period_id, course_id, teacher_id)
					VALUES ($section, $period_id, $course_id, $teacher_id)`);

			query.run({
				$section: chargeData.section,
				$period_id: chargeData.period_id,
				$course_id: chargeData.course_id,
				$teacher_id: chargeData.teacher_id,
			});
		} catch (err) {
			throw new HTTPException(500, { message: "Internal Server Error" });
		}
	}
}
