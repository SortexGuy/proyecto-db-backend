import { Database } from "bun:sqlite";
import { QualificationRepository } from "@/models/repositories/qualification";
import { Qualification, qualificationSchema } from "@/models/qualification";
import {
	ExtQualification,
	extQualificationSchema,
} from "@/models/qualification";

export class BunQualificationRepository implements QualificationRepository {
	private db: Database;

	constructor(db: Database) {
		this.db = db;
	}

	async getQualificationById(id: string): Promise<Qualification | null> {
		try {
			const query = this.db.query(`SELECT * FROM qualification WHERE id = $id`);

			const result = await query.get({
				$id: id,
			});

			return qualificationSchema.parse(result);
		} catch (err) {
			console.error(err);
			return null;
		}
	}

	async getQualificationsByStudentId(
		id: string,
	): Promise<ExtQualification[] | null> {
		try {
			const query = this.db.query(`
				SELECT
				  q.id, q.value, q.lapse,
				  charge.section,
				  p.start_date, p.end_date,
				  c.name AS course_name, c.year AS course_year, charge.teacher_id
				  teacher.user_id AS teacher_id
				FROM qualification AS q
					INNER JOIN charge ON q.charge_id = charge.id
					INNER JOIN teacher ON charge.teacher_id = teacher.id
					INNER JOIN period AS p ON charge.period_id = p.id
					INNER JOIN course AS c ON charge.course_id = c.id
				WHERE q.student_id = $id;
			`);

			const result = query.all({
				$id: id,
			});

			console.log(result);
			return extQualificationSchema.array().parse(result);
		} catch (err) {
			console.error(err);
			return [];
		}
	}
}
