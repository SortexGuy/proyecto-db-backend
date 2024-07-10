import { Database } from "bun:sqlite";

const db = new Database("./database/db.sqlite");

type UserToInsert = {
	$username: string;
	$password: string;
	$ic: string;
	$name: string;
	$last_name: string;
} & (
	| {
			$role: "teacher";
	  }
	| {
			$role: "representative";
	  }
	| {
			$role: "coordinator";
			$entry_date: string;
			$withdraw_date: string | null;
	  }
);

type StudentToInsert = {
	$ic: string;
	$name: string;
	$last_name: string;
};

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
	const insertUser = db.query(
		`INSERT INTO user (username, password, role) VALUES ($username, $password, $role);`,
	);

	const insertCoordinator = db.prepare(
		`INSERT INTO coordinator (user_id, ic, name, last_name, entry_date, withdraw_date) VALUES ($user_id, $ic, $name, $last_name, $entry_date, $withdraw_date);`,
	);

	const insertRepresentative = db.prepare(
		`INSERT INTO representative (user_id, ic, name, last_name) VALUES ($user_id, $ic, $name, $last_name);`,
	);

	const insertTeacher = db.prepare(
		`INSERT INTO teacher (user_id, ic, name, last_name) VALUES ($user_id, $ic, $name, $last_name);`,
	);

	const insertStudent = db.prepare(
		`INSERT INTO student (ic, name, last_name) VALUES ($ic, $name, $last_name);`,
	);

	const insertRepresentativeStudent = db.prepare(
		`INSERT INTO representative_student (representative_id, student_id) VALUES ($representative_id, $student_id);`,
	);

	const insertUserTransaction = db.transaction((users) => {
		const usersValues = users as UserToInsert[];

		for (const user of usersValues) {
			const hashedPassword = Bun.password.hashSync(user.$password, {
				algorithm: "bcrypt",
			});

			const insertedUser = insertUser.run({
				$username: user.$username,
				$password: hashedPassword,
				$role: user.$role,
			});

			if (user.$role === "coordinator") {
				insertCoordinator.run({
					$user_id: insertedUser.lastInsertRowid,
					$ic: user.$ic,
					$name: user.$name,
					$last_name: user.$last_name,
					$entry_date: user.$entry_date,
					$withdraw_date: user.$withdraw_date,
				});
			} else if (user.$role === "representative") {
				insertRepresentative.run({
					$user_id: insertedUser.lastInsertRowid,
					$ic: user.$ic,
					$name: user.$name,
					$last_name: user.$last_name,
				});
			} else if (user.$role === "teacher") {
				insertTeacher.run({
					$user_id: insertedUser.lastInsertRowid,
					$ic: user.$ic,
					$name: user.$name,
					$last_name: user.$last_name,
				});
			}
		}

		return users.length;
	});

	const insertStudentTransaction = db.transaction((students) => {
		const studentValues = students as StudentToInsert[];

		for (const student of studentValues) {
			const insertedStudent = insertStudent.run({
				$ic: student.$ic,
				$name: student.$name,
				$last_name: student.$last_name,
			});
		}

		return students.length;
	});

	const insertRepStudentTransaction = db.transaction((repStudentRelations) => {
		const relationsValues = repStudentRelations as {$rep_id: number, $student_id: number}[];

		for (const relationship of relationsValues) {
			const insertedRelationships = insertRepresentativeStudent.run({
				$representative_id: relationship.$rep_id,
				$student_id: relationship.$student_id,
			});
		}

		return repStudentRelations.length;
	});


	const coordinators: UserToInsert[] = [
		{
			$username: "tbraunston0",
			$password: "tbraunston0",
			$ic: "v18010225",
			$name: "Thor",
			$last_name: "Braunston",
			$role: "coordinator",
			$entry_date: "5/6/2021",
			$withdraw_date: null,
		},
		{
			$username: "ecoghlin1",
			$password: "ecoghlin1",
			$ic: "v13959292",
			$name: "Engracia",
			$last_name: "Coghlin",
			$role: "coordinator",
			$entry_date: "2/18/2019",
			$withdraw_date: null,
		},
		{
			$username: "tmckellen2",
			$password: "tmckellen2",
			$ic: "v18431760",
			$name: "Tobias",
			$last_name: "Mc Kellen",
			$role: "coordinator",
			$entry_date: "3/24/2022",
			$withdraw_date: "9/3/2023",
		},
		{
			$username: "ncaldaro3",
			$password: "ncaldaro3",
			$ic: "v11707054",
			$name: "Nell",
			$last_name: "Caldaro",
			$role: "coordinator",
			$entry_date: "11/26/2020",
			$withdraw_date: null,
		},
		{
			$username: "sblades4",
			$password: "sblades4",
			$ic: "v19938161",
			$name: "Saundra",
			$last_name: "Blades",
			$role: "coordinator",
			$entry_date: "8/17/2016",
			$withdraw_date: "12/12/2023",
		},
		{
			$username: "mscuse5",
			$password: "mscuse5",
			$ic: "v13973706",
			$name: "Murielle",
			$last_name: "Scuse",
			$role: "coordinator",
			$entry_date: "9/17/2021",
			$withdraw_date: null,
		},
	];

	const teachers: UserToInsert[] = [
		{
			$username: "rrackstraw0",
			$password: "rrackstraw0",
			$ic: "v25198522",
			$name: "Rikki",
			$last_name: "Rackstraw",
			$role: "teacher",
		},
		{
			$username: "cstonehewer1",
			$password: "cstonehewer1",
			$ic: "v25949689",
			$name: "Cayla",
			$last_name: "Stonehewer",
			$role: "teacher",
		},
		{
			$username: "kkemet2",
			$password: "kkemet2",
			$ic: "v25030179",
			$name: "Katinka",
			$last_name: "Kemet",
			$role: "teacher",
		},
		{
			$username: "bcorzor3",
			$password: "bcorzor3",
			$ic: "v25643520",
			$name: "Blancha",
			$last_name: "Corzor",
			$role: "teacher",
		},
		{
			$username: "llivsey4",
			$password: "llivsey4",
			$ic: "v25599739",
			$name: "Lida",
			$last_name: "Livsey",
			$role: "teacher",
		},
		{
			$username: "mconnachan5",
			$password: "mconnachan5",
			$ic: "v25730515",
			$name: "Monty",
			$last_name: "Connachan",
			$role: "teacher",
		},
	];
	const representatives: UserToInsert[] = [
		{
			$username: "adowning0",
			$password: "adowning0",
			$ic: "v23111312",
			$name: "Ashlie",
			$last_name: "Downing",
			$role: "representative",
		},
		{
			$username: "bfeirn1",
			$password: "bfeirn1",
			$ic: "v23277486",
			$name: "Bethany",
			$last_name: "Feirn",
			$role: "representative",
		},
		{
			$username: "estilliard2",
			$password: "estilliard2",
			$ic: "v23352216",
			$name: "Etty",
			$last_name: "Stilliard",
			$role: "representative",
		},
		{
			$username: "mtenbroek3",
			$password: "mtenbroek3",
			$ic: "v23035813",
			$name: "Marika",
			$last_name: "Ten Broek",
			$role: "representative",
		},
		{
			$username: "kmccurdy4",
			$password: "kmccurdy4",
			$ic: "v23103350",
			$name: "Kiele",
			$last_name: "McCurdy",
			$role: "representative",
		},
		{
			$username: "mchidgey5",
			$password: "mchidgey5",
			$ic: "v23579305",
			$name: "Myrah",
			$last_name: "Chidgey",
			$role: "representative",
		},
	];

	const students: StudentToInsert[] = [
		{
			$ic: "v31852753",
			$name: "Arvy",
			$last_name: "Goncaves",
		},
		{
			$ic: "v31673789",
			$name: "Yancey",
			$last_name: "Whitworth",
		},
		{
			$ic: "v31386081",
			$name: "Rosalyn",
			$last_name: "Wansbury",
		},
		{
			$ic: "v31449913",
			$name: "Gabriel",
			$last_name: "Bernolet",
		},
		{
			$ic: "v31712664",
			$name: "Stormi",
			$last_name: "Teanby",
		},
		{
			$ic: "v31478641",
			$name: "Forrester",
			$last_name: "Donoghue",
		},
	];

	const repStudentRelations: {$rep_id: number, $student_id: number}[] = [
		{$rep_id: 1, $student_id: 1},
		{$rep_id: 2, $student_id: 1},
		{$rep_id: 2, $student_id: 2},
		{$rep_id: 3, $student_id: 2},
		{$rep_id: 3, $student_id: 3},
		{$rep_id: 4, $student_id: 3},
		{$rep_id: 4, $student_id: 4},
		{$rep_id: 5, $student_id: 4},
		{$rep_id: 5, $student_id: 5},
		{$rep_id: 6, $student_id: 5},
		{$rep_id: 6, $student_id: 6},
		{$rep_id: 1, $student_id: 6},
	];

	const coordinatorsResult = insertUserTransaction(coordinators);
	const teachersResult = insertUserTransaction(teachers);
	const representativesResult = insertUserTransaction(representatives);
	const studentsResult = insertStudentTransaction(students);
	const repStudentRelationsResult = insertRepStudentTransaction(repStudentRelations);

	console.log("Inserted:");
	console.log(`${coordinatorsResult} coordinators`);
	console.log(`${teachersResult} teachers`);
	console.log(`${representativesResult} representatives`);
	console.log(`${studentsResult} students`);
	console.log(`${repStudentRelationsResult} representative-student relationships`);
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
