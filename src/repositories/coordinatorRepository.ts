import { Database } from "bun:sqlite";
import {
	Coordinator,
	NewCoordinator,
	UpdatedCoordinator,
	coordinatorSchema,
} from "@/models/coordinator";
import { CoordinatorRepository } from "@/models/repositories/coordinator";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";

const countResultSchema = z.object({ count: z.number() });

export class BunCoordinatorRepository implements CoordinatorRepository {
	private db: Database;

	constructor(db: Database) {
		this.db = db;
	}

	async getCoordinatorByUserId(id: string): Promise<Coordinator | null> {
		try {
			const query = this.db.query(
				`SELECT * FROM coordinator WHERE user_id = $id`,
			);

			const result = await query.get({
				$id: id,
			});

			return coordinatorSchema.parse(result);
		} catch (err) {
			console.error(err);
			return null;
		}
	}

	async aggregateCoordinator(coordinator: NewCoordinator): Promise<void> {
		const preQuery = this.db.query(`
			SELECT COUNT(id) AS count FROM user WHERE username = $username;`);
		const result = await preQuery.get({ $username: coordinator.username });

		if (countResultSchema.parse(result).count > 0) {
			console.log(result);
			throw new HTTPException(400, { message: "Username already exists" });
		}

		try {
			const userQuery = this.db.query(`
				INSERT INTO user (username, password, role)
					VALUES ($username, $password, 'coordinator');
			`);
			userQuery.run({
				$username: coordinator.username,
				$password: coordinator.password,
			});

			const query = this.db.query(`
				INSERT INTO coordinator (ic, name, last_name, entry_date, withdraw_date, user_id)
					VALUES ($ic, $name, $last_name, $entry_date, $withdraw_date,
						(SELECT id FROM user WHERE username = $username));
			`);
			query.run({
				$ic: coordinator.ic,
				$name: coordinator.name,
				$last_name: coordinator.last_name,
				$entry_date: coordinator.entry_date,
				$withdraw_date: coordinator.withdraw_date || null,
				$username: coordinator.username,
			});
		} catch (err) {
			console.error(err);
			throw new HTTPException(500, { message: "Internal Server Error" });
		}
	}

	updateCoordinator(id: number, coordinator: UpdatedCoordinator): void {
		let queryStr = `UPDATE coordinator SET`;
		let params: any = { $id: id };
		for (const [key, value] of Object.entries(coordinator)) {
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
