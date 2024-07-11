import { Database } from "bun:sqlite";
import { insertUsersCallback } from "./seed/users";
import { insertStudentsCallback } from "./seed/students";
import { insertQualificationsCallback } from "./seed/qualifications";

const db = new Database("./database/db.sqlite");

const seed = async () => {
	const { coordinatorsResult, teachersResult, representativesResult } =
		await insertUsersCallback(db);
	const { studentsResult, repStudentRelationsResult } =
		await insertStudentsCallback(db);
	const { periodResults, courseResults, chargeResults, qualificationResults } =
		await insertQualificationsCallback(db);

	console.log("Inserted:");
	console.log(`${coordinatorsResult} coordinators`);
	console.log(`${teachersResult} teachers`);
	console.log(`${representativesResult} representatives`);
	console.log(`${studentsResult} students`);
	console.log(
		`${repStudentRelationsResult} representative-student relationships`,
	);
	console.log(`${periodResults} periods`);
	console.log(`${courseResults} courses`);
	console.log(`${chargeResults} charges`);
	console.log(`${qualificationResults} qualifications`);
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
