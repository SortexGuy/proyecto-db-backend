import { Database } from "bun:sqlite";
import { Representative, representativeSchema } from "@/models/representative";
import { RepresentativeRepository } from "@/models/repositories/representative";
import { Student, studentSchema } from "@/models/student";

export class BunRepresentativeRepository implements RepresentativeRepository {
	private db: Database;

	constructor(db: Database) {
		this.db = db;
	}

	async getRepresentativeByUserId(id: string): Promise<Representative | null> {
		try {
			const query = this.db.query(
				`SELECT * FROM representative WHERE user_id = $id`,
			);

			const result = await query.get({
				$id: id,
			});

			return representativeSchema.parse(result);
		} catch (err) {
			console.error(err);
			return null;
		}
	}

	async getStudentsByRepresentativeId(id: string): Promise<Student[]> {
		try {
			const query = this.db.query(`
				SELECT
					student.id,
					student.ic,
					student.name,
					student.last_name,
					student.current_year,
					student.status
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
}
