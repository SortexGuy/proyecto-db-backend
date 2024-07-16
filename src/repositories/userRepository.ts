import { Database } from "bun:sqlite";
import { UserRepository } from "@/models/repositories/user";
import { NewUser, User, userSchema } from "@/models/user";
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

	createUser(user: NewUser): void {
		try {
			const query = this.db
				.query(`INSERT INTO student (username, password, role)
					VALUES ($username, $password, $role)`);

			query.run({
				$username: user.username,
				$password: user.password,
				$role: user.role,
			});
		} catch (err) {
			console.error(err);
			throw new HTTPException(500, { message: "Internal Server Error" });
		}
	}
}
