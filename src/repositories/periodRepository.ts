import { Database } from "bun:sqlite";
import { PeriodRepository } from "@/models/repositories/period";
import { Period, periodSchema } from "@/models/period";
import { HTTPException } from "hono/http-exception";

export class BunPeriodRepository implements PeriodRepository {
	private db: Database;

	constructor(db: Database) {
		this.db = db;
	}

	async getPeriodById(id: string): Promise<Period | null> {
		try {
			const query = this.db.query(`SELECT * FROM period WHERE id = $id`);

			const result = await query.get({
				$id: id,
			});

			return periodSchema.parse(result);
		} catch (err) {
			console.error(err);
			return null;
		}
	}

	async getAllPeriods(): Promise<Period[]> {
		try {
			const query = this.db.query(`SELECT * FROM period`);

			const result = query.all();

			return periodSchema.array().parse(result);
		} catch (err) {
			console.error(err);
			return [];
		}
	}

	createPeriod(period: any) {
		try {
			const periodData = periodSchema.omit({ id: true }).parse(period);

			const query = this.db.query(`INSERT INTO period (start_date, end_date)
					VALUES ($start_date, $end_date)`);

			query.run({
				$start_date: periodData.start_date,
				$end_date: periodData.end_date,
			});
		} catch (err) {
			throw new HTTPException(500, { message: "Internal Server Error" });
		}
	}
}
