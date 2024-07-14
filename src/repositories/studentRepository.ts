import { Database } from "bun:sqlite";
import { StudentRepository } from "@/models/repositories/student";
import { Student, studentSchema } from "@/models/student";

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
}
