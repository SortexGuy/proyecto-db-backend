import { Database } from "bun:sqlite";
import { UserRepository } from "@/models/repositories/user";
import { NewUser, UpdatedUser, User, userSchema } from "@/models/user";
import { HTTPException } from "hono/http-exception";

export class BunUserRepository implements UserRepository {
	private db: Database;

	constructor(db: Database) {
		this.db = db;
	}

	async getUserById(id: string): Promise<User | null> {
		try {
			const query = this.db.query(`SELECT * FROM user WHERE id = $id`);

			const result = await query.get({
				$id: id,
			});

			return userSchema.parse(result);
		} catch (err) {
			console.error(err);
			return null;
		}
	}

	async getUserByUsername(username: string): Promise<User | null> {
		try {
			const query = this.db.query(
				`SELECT * FROM user WHERE username = $username`,
			);

			const result = await query.get({
				$username: username,
			});

			return userSchema.parse(result);
		} catch (err) {
			console.error(err);
			return null;
		}
	}

	updateUser(id: number, user: UpdatedUser): void {
		let queryStr = `UPDATE user SET`;
		let params: any = { $id: id };
		for (const [key, value] of Object.entries(user)) {
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
