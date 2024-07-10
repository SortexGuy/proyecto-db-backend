import { Database } from "bun:sqlite";
import { insertUsersCallback } from "./seed/user";
import { insertStudentsCallback } from "./seed/students";

const db = new Database("./database/db.sqlite");

// TODO: Create types for these
//
// CREATE TABLE IF NOT EXISTS period (
//   id INTEGER PRIMARY KEY AUTOINCREMENT,
//   start_date DATE NOT NULL,
//   end_date DATE NOT NULL
// );
//
// CREATE TABLE IF NOT EXISTS course (
//   id INTEGER PRIMARY KEY AUTOINCREMENT,
//   name TEXT NOT NULL,
//   year INTEGER NOT NULL
// );

const seed = async () => {
	const { coordinatorsResult, teachersResult, representativesResult } =
		await insertUsersCallback(db);
	const { studentsResult, repStudentRelationsResult } =
		await insertStudentsCallback(db);

	console.log("Inserted:");
	console.log(`${coordinatorsResult} coordinators`);
	console.log(`${teachersResult} teachers`);
	console.log(`${representativesResult} representatives`);
	console.log(`${studentsResult} students`);
	console.log(
		`${repStudentRelationsResult} representative-student relationships`,
	);
};

seed()
	.then(() => {
		console.log("Seed complete");
	})
	.catch((err) => {
		console.error(err);
	})
	.finally(() => {
		db.close();
	});
