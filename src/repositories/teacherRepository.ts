import { Database } from "bun:sqlite";
import { TeacherRepository } from "@/models/repositories/teacher";
import { Charge, ExtCharge, NewCharge, extChargeSchema } from "@/models/charge";
import {
	teacherSchema,
	Teacher,
	NewTeacher,
	UpdatedTeacher,
} from "@/models/teacher";
import { HTTPException } from "hono/http-exception";
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

	async getExtChargeById(id: string): Promise<ExtCharge | null> {
		try {
			const query = this.db.query(`SELECT * FROM charge WHERE id = $id`);
			const result = await query.get({ $id: id });

			return extChargeSchema.parse(result);
		} catch (err) {
			console.error(err);
			return null;
		}
	}

	async getTeacherAcademicChargesByTeacherId(id: string): Promise<ExtCharge[]> {
		try {
			const query = this.db.query(`
				SELECT charge.id, charge.section,
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

			return extChargeSchema.array().parse(result);
		} catch (err) {
			console.error(err);
			return [];
		}
	}

	async aggregateTeacher(teacher: NewTeacher): Promise<void> {
		const preQuery = this.db.query(`
			SELECT COUNT(id) AS count FROM user WHERE username = $username;`);
		const result: any = await preQuery.get({ $username: teacher.username });

		if (z.number().parse(result.count) > 0) {
			throw new HTTPException(400, { message: "Username already exists" });
		}

		try {
			const userQuery = this.db.query(`
				INSERT INTO user (username, password, role)
					VALUES ($username, $password, 'teacher');
			`);
			userQuery.run({
				$username: teacher.username,
				$password: teacher.password,
			});

			const query = this.db.query(`
				INSERT INTO teacher (ic, name, last_name, contact, user_id)
					VALUES ($ic, $name, $last_name, $contact,
						(SELECT id FROM user WHERE username = $username));
			`);
			query.run({
				$ic: teacher.ic,
				$name: teacher.name,
				$last_name: teacher.last_name,
				$username: teacher.username,
			});
		} catch (err) {
			console.error(err);
			throw new HTTPException(500, { message: "Internal Server Error" });
		}
	}

	asignNewCharge(charge: NewCharge): void {
		try {
			const query = this.db
				.query(`INSERT INTO charge (section, period_id, course_id, teacher_id)
					VALUES ($section, $period_id, $course_id, $teacher_id)`);

			query.run({
				$section: charge.section,
				$period_id: charge.period_id,
				$course_id: charge.course_id,
				$teacher_id: charge.teacher_id,
			});
		} catch (err) {
			console.error(err);
			throw new HTTPException(500, { message: "Internal Server Error" });
		}
	}

	updateTeacher(id: number, teacher: UpdatedTeacher): void {
		let queryStr = `UPDATE teacher SET`;
		let params: any = { $id: id };
		for (const [key, value] of Object.entries(teacher)) {
			queryStr += ` ${key} = $${key},`;
			params[`$${key}`] = value;
		}
		queryStr = queryStr.slice(0, -1) + ` WHERE id = $id`;

		try {
			const query = this.db.query(queryStr);
			query.run(params);
		} catch (err) {
			console.error(err);
			throw new HTTPException(500, { message: "Internal Server Error" });
		}
	}
}
