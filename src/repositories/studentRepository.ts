import { Database } from "bun:sqlite";
import { StudentRepository } from "@/models/repositories/student";
import {
	NewStudent,
	Student,
	StudentInfo,
	UpdatedStudent,
	studentInfoSchema,
	studentSchema,
} from "@/models/student";
import { HTTPException } from "hono/http-exception";

export class BunStudentRepository implements StudentRepository {
	private db: Database;

	constructor(db: Database) {
		this.db = db;
	}

	async getStudentById(id: string): Promise<Student | null> {
		try {
			const query = this.db.query(`SELECT * FROM student WHERE id = $id`);

			const result = await query.get({
				$id: id,
			});

			return studentSchema.parse(result);
		} catch (err) {
			console.error(err);
			return null;
		}
	}

	async getStudentInfoByIc(ic: string): Promise<StudentInfo | null> {
		try {
			const repQuery = this.db.query(`
				SELECT r.id, r.ic, r.name, r.last_name, r.user_id
				FROM representative_student AS rs
					INNER JOIN representative AS r ON rs.representative_id = r.id
					INNER JOIN student AS s ON rs.student_id = s.id
				WHERE s.ic = $ic;
		`);
			const query = this.db.query(`SELECT * FROM student WHERE ic = $ic`);

			const repResult = repQuery.all({
				$ic: ic,
			});
			console.log(repResult);
			let result: any = await query.get({
				$ic: ic,
			});
			result.representatives = repResult;
			console.log(result);

			return studentInfoSchema.parse(result);
		} catch (err) {
			console.error(err);
			return null;
		}
	}

	async getAllStudents(): Promise<Student[]> {
		try {
			const query = this.db.query(`SELECT * FROM student`);

			const result = query.all();

			return studentSchema.array().parse(result);
		} catch (err) {
			console.error(err);
			return [];
		}
	}

	aggregateStudent(student: NewStudent): void {
		try {
			const query = this.db
				.query(`INSERT INTO student (ic, name, last_name, current_year, status)
					VALUES ($ic, $name, $last_name, $current_year, $status)`);

			query.run({
				$ic: student.ic,
				$name: student.name,
				$last_name: student.last_name,
				$current_year: student.current_year,
				$status: student.status,
			});
		} catch (err) {
			console.error(err);
			throw new HTTPException(500, { message: "Internal Server Error" });
		}
	}

	updateStudent(id: number, student: UpdatedStudent): void {
		let queryStr = `UPDATE student SET`;
		let params: any = { $id: id };
		for (const [key, value] of Object.entries(student)) {
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
