import { Database } from "bun:sqlite";
import { Coordinator, coordinatorSchema } from "@/models/coordinator";
import { CoordinatorRepository } from "@/models/repositories/coordinator";

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
}
