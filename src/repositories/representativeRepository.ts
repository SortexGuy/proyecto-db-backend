import { Database } from "bun:sqlite";
import {
	NewRepresentative,
	Representative,
	representativeSchema,
} from "@/models/representative";
import { RepresentativeRepository } from "@/models/repositories/representative";
import { Student, studentSchema } from "@/models/student";
import { HTTPException } from "hono/http-exception";
import { NewRepStudent } from "@/models/repStudent";
import { z } from "zod";

export class BunRepresentativeRepository implements RepresentativeRepository {
	private db: Database;

	constructor(db: Database) {
		this.db = db;
	}

	async getRepresentativeByUserId(id: string): Promise<Representative | null> {
		try {
			const query = this.db.query(`
				SELECT * FROM representative WHERE user_id = $id
			`);

			const result = await query.get({
				$id: id,
			});

			return representativeSchema.parse(result);
		} catch (err) {
			console.error(err);
			return null;
		}
	}

	async getAllRepresentatives(): Promise<Representative[]> {
		try {
			const query = this.db.query(`SELECT * FROM representative`);

			const result = query.all();

			return representativeSchema.array().parse(result);
		} catch (err) {
			console.error(err);
			return [];
		}
	}

	async getStudentsByRepresentativeId(id: string): Promise<Student[]> {
		try {
			const query = this.db.query(`
				SELECT
					student.id, student.ic, student.name, student.last_name,
					student.current_year, student.status
				FROM representative_student AS rel
					INNER JOIN student ON rel.student_id = student.id
				WHERE representative_id = $id;
			`);

			const result = query.all({
				$id: id,
			});

			console.log(result);
			return studentSchema.array().parse(result);
		} catch (err) {
			console.error(err);
			return [];
		}
	}

	async aggregateRepresentative(
		representative: NewRepresentative,
	): Promise<void> {
		const preQuery = this.db.query(`
			SELECT COUNT(id) AS count FROM user WHERE username = $username;`);
		const result: any = await preQuery.get({
			$username: representative.username,
		});

		if (z.number().parse(result.count) > 0) {
			throw new HTTPException(400, { message: "Username already exists" });
		}

		try {
			const userQuery = this.db.query(`
				INSERT INTO user (username, password, role)
					VALUES ($username, $password, 'representative');
			`);
			userQuery.run({
				$username: representative.username,
				$password: representative.password,
			});

			const query = this.db.query(`
				INSERT INTO representative (ic, name, last_name, user_id)
					VALUES ($ic, $name, $last_name,
						(SELECT id FROM user WHERE username = $username));
			`);
			query.run({
				$ic: representative.ic,
				$name: representative.name,
				$last_name: representative.last_name,
				$username: representative.username,
			});
		} catch (err) {
			console.error(err);
			throw new HTTPException(500, { message: "Internal Server Error" });
		}
	}

	async aggregateStudentToRepresentative(
		repStudent: NewRepStudent,
	): Promise<void> {
		const preQuery = this.db
			.query(`SELECT COUNT(*) AS count FROM representative_student
				WHERE student_id = $student_id`);
		const result: any = await preQuery.get({
			$student_id: repStudent.student_id,
		});
		const count = z.number().parse(result.count);
		if (count >= 3) {
			throw new HTTPException(400, {
				message: "student already has 3 representatives",
			});
		}

		try {
			const query = this.db
				.query(`INSERT INTO representative_student (representative_id, student_id)
					VALUES ($representative_id, $student_id)`);

			query.run({
				$representative_id: repStudent.representative_id,
				$student_id: repStudent.student_id,
			});
		} catch (err) {
			console.error(err);
			throw new HTTPException(500, { message: "Internal Server Error" });
		}
	}
}
