import { Database } from "bun:sqlite";
import { QualificationRepository } from "@/models/repositories/qualification";
import {
	NewQualification,
	Qualification,
	SearchQualification,
	UpdatedQualification,
	qualificationSchema,
} from "@/models/qualification";
import {
	ExtQualification,
	extQualificationSchema,
} from "@/models/qualification";
import { HTTPException } from "hono/http-exception";

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
				  charge.id AS charge_id, charge.section,
				  p.start_date, p.end_date,
				  c.name AS course_name, c.year AS course_year, 
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

			return extQualificationSchema.array().parse(result);
		} catch (err) {
			console.error(err);
			return [];
		}
	}

	aggregateQualification(qualification: NewQualification): void {
		try {
			const query = this.db
				.query(`INSERT INTO qualification (value, lapse, charge_id, student_id)
					VALUES ($value, $lapse, $charge_id, $student_id)`);

			query.run({
				$value: qualification.value,
				$lapse: qualification.lapse,
				$charge_id: qualification.charge_id,
				$student_id: qualification.student_id,
			});
		} catch (err) {
			console.error(err);
			throw new HTTPException(500, { message: "Internal Server Error" });
		}
	}

	updateQualification(id: number, qualification: UpdatedQualification): void {
		let queryStr = `UPDATE qualification SET`;
		let params: any = { $id: id };
		for (const [key, value] of Object.entries(qualification)) {
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

	async searchQualification(
		qualification: SearchQualification,
	): Promise<ExtQualification[]> {
		let queryStr = `SELECT
				  q.id, q.value, q.lapse,
				  charge.id AS charge_id, charge.section,
				  p.start_date, p.end_date,
				  c.name AS course_name, c.year AS course_year, 
				  teacher.user_id AS teacher_id
				FROM qualification AS q
					INNER JOIN charge ON q.charge_id = charge.id
					INNER JOIN teacher ON charge.teacher_id = teacher.id
					INNER JOIN period AS p ON charge.period_id = p.id
					INNER JOIN course AS c ON charge.course_id = c.id
				`;
		let params: any = {};
		if (Object.keys(qualification).length > 0) {
			queryStr += `WHERE   `;
			const qKeys = ["value", "lapse"];
			qKeys.forEach((key) => {
				if (qualification.hasOwnProperty(key)) {
					queryStr += ` q.${key} = $${key} AND`;
					params[`$${key}`] = qualification[key as keyof SearchQualification];
				}
			});
			if (qualification.hasOwnProperty("charge_id")) {
				queryStr += ` charge.id = $charge_id AND`;
				params[`$charge_id`] = qualification.charge_id;
			}
			if (qualification.hasOwnProperty("section")) {
				queryStr += ` charge.section = $section AND`;
				params[`$section`] = qualification.section;
			}
			const pKeys = ["start_date", "end_date"];
			pKeys.forEach((key) => {
				if (qualification.hasOwnProperty(key)) {
					queryStr += ` p.${key} = $${key} AND`;
					params[`$${key}`] = qualification[key as keyof SearchQualification];
				}
			});
			const cKeys = ["course_year", "course_name"];
			const cRealKeys = ["year", "name"];
			cKeys.forEach((key, i) => {
				if (qualification.hasOwnProperty(key)) {
					queryStr += ` c.${cRealKeys[i]} = $${key} AND`;
					params[`$${key}`] = qualification[key as keyof SearchQualification];
				}
			});
			if (qualification.hasOwnProperty("teacher_id")) {
				queryStr += ` teacher.user_id = $teacher_id AND`;
			}
			queryStr = queryStr.slice(0, -3) + `;`;
		}
		try {
			const query = this.db.query(queryStr);
			const result = query.all(params);

			return extQualificationSchema.array().parse(result);
		} catch (err) {
			console.error(err);
			throw new HTTPException(500, { message: "Internal Server Error" });
		}
	}
}
