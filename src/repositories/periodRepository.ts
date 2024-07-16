import { Database } from "bun:sqlite";
import { PeriodRepository } from "@/models/repositories/period";
import {
	NewPeriod,
	Period,
	UpdatedPeriod,
	periodSchema,
} from "@/models/period";
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

	createPeriod(period: NewPeriod) {
		try {
			const query = this.db.query(`INSERT INTO period (start_date, end_date)
					VALUES ($start_date, $end_date)`);

			query.run({
				$start_date: period.start_date,
				$end_date: period.end_date,
			});
		} catch (err) {
			console.error(err);
			throw new HTTPException(500, { message: "Internal Server Error" });
		}
	}

	updatePeriod(id: number, period: UpdatedPeriod): void {
		let queryStr = `UPDATE period SET`;
		let params: any = { $id: id };
		for (const [key, value] of Object.entries(period)) {
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
