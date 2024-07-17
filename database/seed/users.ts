import { Database } from "bun:sqlite";

type UserToInsert = {
	$username: string;
	$password: string;
	$ic: string;
	$name: string;
	$last_name: string;
	$contact: string;
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

export async function insertUsersCallback(db: Database): Promise<{
	coordinatorsResult: number;
	representativesResult: number;
	teachersResult: number;
}> {
	const insertUser = db.query(
		`INSERT INTO user (username, password, role) VALUES ($username, $password, $role);`,
	);

	const insertCoordinator = db.prepare(
		`INSERT INTO coordinator (user_id, ic, name, last_name, contact, entry_date, withdraw_date)
			VALUES ($user_id, $ic, $name, $last_name, $contact, $entry_date, $withdraw_date);`,
	);

	const insertRepresentative = db.prepare(
		`INSERT INTO representative (user_id, ic, name, last_name, contact)
			VALUES ($user_id, $ic, $name, $last_name, $contact);`,
	);

	const insertTeacher = db.prepare(
		`INSERT INTO teacher (user_id, ic, name, last_name, contact)
			VALUES ($user_id, $ic, $name, $last_name, $contact);`,
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
					$contact: user.$contact,
					$entry_date: user.$entry_date,
					$withdraw_date: user.$withdraw_date,
				});
			} else if (user.$role === "representative") {
				insertRepresentative.run({
					$user_id: insertedUser.lastInsertRowid,
					$ic: user.$ic,
					$name: user.$name,
					$last_name: user.$last_name,
					$contact: user.$contact,
				});
			} else if (user.$role === "teacher") {
				insertTeacher.run({
					$user_id: insertedUser.lastInsertRowid,
					$ic: user.$ic,
					$name: user.$name,
					$last_name: user.$last_name,
					$contact: user.$contact,
				});
			}
		}

		return users.length;
	});

	const coordinators: UserToInsert[] = [
		{
			$username: "tbraunston0",
			$password: "tbraunston0",
			$ic: "v18010225",
			$name: "Thor",
			$last_name: "Braunston",
			$contact: "0426-4485319",
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
			$contact: "0416-4348939",
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
			$contact: "0426-4587329",
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
			$contact: "0426-2495385",
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
			$contact: "0426-4888613",
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
			$contact: "0426-4995459",
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
			$contact: "0426-4488339",
			$role: "teacher",
		},
		{
			$username: "cstonehewer1",
			$password: "cstonehewer1",
			$ic: "v25949689",
			$name: "Cayla",
			$last_name: "Stonehewer",
			$contact: "0426-4985413",
			$role: "teacher",
		},
		{
			$username: "kkemet2",
			$password: "kkemet2",
			$ic: "v25030179",
			$name: "Katinka",
			$last_name: "Kemet",
			$contact: "0426-9085364",
			$role: "teacher",
		},
		{
			$username: "bcorzor3",
			$password: "bcorzor3",
			$ic: "v25643520",
			$name: "Blancha",
			$last_name: "Corzor",
			$contact: "0426-0435809",
			$role: "teacher",
		},
		{
			$username: "llivsey4",
			$password: "llivsey4",
			$ic: "v25599739",
			$name: "Lida",
			$last_name: "Livsey",
			$contact: "0426-1405689",
			$role: "teacher",
		},
		{
			$username: "mconnachan5",
			$password: "mconnachan5",
			$ic: "v25730515",
			$name: "Monty",
			$last_name: "Connachan",
			$contact: "0426-8788309",
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
			$contact: "0416-4890309",
			$role: "representative",
		},
		{
			$username: "bfeirn1",
			$password: "bfeirn1",
			$ic: "v23277486",
			$name: "Bethany",
			$last_name: "Feirn",
			$contact: "0426-0430399",
			$role: "representative",
		},
		{
			$username: "estilliard2",
			$password: "estilliard2",
			$ic: "v23352216",
			$name: "Etty",
			$last_name: "Stilliard",
			$contact: "0426-8438019",
			$role: "representative",
		},
		{
			$username: "mtenbroek3",
			$password: "mtenbroek3",
			$ic: "v23035813",
			$name: "Marika",
			$last_name: "Ten Broek",
			$contact: "0426-0786339",
			$role: "representative",
		},
		{
			$username: "kmccurdy4",
			$password: "kmccurdy4",
			$ic: "v23103350",
			$name: "Kiele",
			$last_name: "McCurdy",
			$contact: "0426-3489009",
			$role: "representative",
		},
		{
			$username: "mchidgey5",
			$password: "mchidgey5",
			$ic: "v23579305",
			$name: "Myrah",
			$last_name: "Chidgey",
			$contact: "0426-1280310",
			$role: "representative",
		},
	];

	const coordinatorsResult = insertUserTransaction(coordinators);
	const teachersResult = insertUserTransaction(teachers);
	const representativesResult = insertUserTransaction(representatives);

	return { coordinatorsResult, teachersResult, representativesResult };
}
