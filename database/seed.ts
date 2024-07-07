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
			$username: "tbraunston5",
			$password: "tbraunston5",
			$ic: "v18680205",
			$name: "Thor",
			$last_name: "Braunston",
			$role: "teacher",
		},
		{
			$username: "jwilliams7",
			$password: "jwilliams7",
			$ic: "v18010226",
			$name: "John",
			$last_name: "Williams",
			$role: "teacher",
		},
		{
			$username: "lsmith3",
			$password: "lsmith3",
			$ic: "v18010227",
			$name: "Linda",
			$last_name: "Smith",
			$role: "teacher",
		},
		{
			$username: "mrodriguez9",
			$password: "mrodriguez9",
			$ic: "v18010228",
			$name: "Maria",
			$last_name: "Rodriguez",
			$role: "teacher",
		},
		{
			$username: "dlee4",
			$password: "dlee4",
			$ic: "v18010229",
			$name: "David",
			$last_name: "Lee",
			$role: "teacher",
		},
		{
			$username: "rlopez2",
			$password: "rlopez2",
			$ic: "v18010230",
			$name: "Rosa",
			$last_name: "Lopez",
			$role: "teacher",
		},
	];
	const representatives: UserToInsert[] = [
		{
			$username: "tbraunston6",
			$password: "tbraunston6",
			$ic: "v18079226",
			$name: "Tina",
			$last_name: "Braunston",
			$role: "representative",
		},
		{
			$username: "jwilliams8",
			$password: "jwilliams8",
			$ic: "v18910248",
			$name: "James",
			$last_name: "Williams",
			$role: "representative",
		},
		{
			$username: "lsmith4",
			$password: "lsmith4",
			$ic: "v18014234",
			$name: "Laura",
			$last_name: "Smith",
			$role: "representative",
		},
		{
			$username: "mrodriguez1",
			$password: "mrodriguez1",
			$ic: "v17014221",
			$name: "Miguel",
			$last_name: "Rodriguez",
			$role: "representative",
		},
		{
			$username: "dlee5",
			$password: "dlee5",
			$ic: "v18719225",
			$name: "Diana",
			$last_name: "Lee",
			$role: "representative",
		},
		{
			$username: "rlopez3",
			$password: "rlopez3",
			$ic: "v22034933",
			$name: "Rafael",
			$last_name: "Lopez",
			$role: "representative",
		},
	];

	const coordinatorsResult = insertUserTransaction(coordinators);
	const teachersResult = insertUserTransaction(teachers);
	const representativesResult = insertUserTransaction(representatives);

	console.log("Inserted:");
	console.log(`${coordinatorsResult} coordinators`);
	console.log(`${teachersResult} teachers`);
	console.log(`${representativesResult} representatives`);
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
