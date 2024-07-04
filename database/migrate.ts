import { Database } from "bun:sqlite";

const db = new Database("./database/db.sqlite");

const migrate = async () => {
	const file = Bun.file("./database/migration.sql");
	const sql = await file.text();
	db.exec(sql);
};

migrate()
	.then(() => {
		console.log("Migration complete");
	})
	.catch((err) => {
		console.error(err);
	})
	.finally(() => {
		db.close();
	});
