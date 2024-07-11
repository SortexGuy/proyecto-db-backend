import { Database } from "bun:sqlite";

type PeriodToInsert = {
	$start_date: string;
	$end_date: string;
};

type CourseToInsert = {
	$name: string;
	$year: number;
};

type ChargeToInsert = {
	$period_id: number;
	$course_id: number;
	$teacher_id: number;
};

type QualificationToInsert = {
	$value: number;
	$section: number;
	$lapse: number;
	$student_id: number;
	$charge_id: number;
};

export async function insertQualificationsCallback(db: Database): Promise<{
	periodResults: number;
	courseResults: number;
	chargeResults: number;
	qualificationResults: number;
}> {
	const insertPeriod = db.prepare(
		`INSERT INTO period (start_date, end_date) VALUES ($start_date, $end_date);`,
	);

	const insertCourse = db.prepare(
		`INSERT INTO course (name, year) VALUES ($name, $year);`,
	);

	const insertCharge = db.prepare(
		`INSERT INTO charge (period_id, course_id, teacher_id)
			VALUES ($period_id, $course_id, $teacher_id);`,
	);

	const insertQualification = db.prepare(
		`INSERT INTO qualification (value, section, lapse, student_id, charge_id)
			VALUES ($value, $section, $lapse, $student_id, $charge_id);`,
	);

	const insertPeriodTransaction = db.transaction((periods) => {
		const periodValues = periods as PeriodToInsert[];

		for (const period of periodValues) {
			const insertedPeriod = insertPeriod.run({
				$start_date: period.$start_date,
				$end_date: period.$end_date,
			});
		}

		return periods.length;
	});

	const insertCourseTransaction = db.transaction((courses) => {
		const courseValues = courses as CourseToInsert[];

		for (const course of courseValues) {
			const insertedCourse = insertCourse.run({
				$name: course.$name,
				$year: course.$year,
			});
		}

		return courses.length;
	});

	const insertChargeTransaction = db.transaction((charges) => {
		const chargeValues = charges as ChargeToInsert[];

		for (const charge of chargeValues) {
			const insertedCharge = insertCharge.run({
				$period_id: charge.$period_id,
				$course_id: charge.$course_id,
				$teacher_id: charge.$teacher_id,
			});
		}

		return charges.length;
	});

	const insertQualificationTransaction = db.transaction((qualifications) => {
		const qualificationValues = qualifications as QualificationToInsert[];

		for (const qualification of qualificationValues) {
			const insertedQualification = insertQualification.run({
				$value: qualification.$value,
				$section: qualification.$section,
				$lapse: qualification.$lapse,

				$student_id: qualification.$student_id,
				$charge_id: qualification.$charge_id,
			});
		}

		return qualifications.length;
	});

	const periods: PeriodToInsert[] = [
		{ $start_date: "2021-10-07", $end_date: "2022-06-28" },
		{ $start_date: "2022-10-05", $end_date: "2023-06-26" },
		{ $start_date: "2023-10-12", $end_date: "2024-06-31" },
	];

	const courses: CourseToInsert[] = [
		{ $name: "Educacion Fisica", $year: 1 }, // 1
		{ $name: "GHC", $year: 1 }, // 2
		{ $name: "Castellano", $year: 1 }, // 3
		{ $name: "Biologia", $year: 1 }, // 4
		{ $name: "Educacion Fisica", $year: 2 }, // 5
		{ $name: "GHC", $year: 2 }, // 6
		{ $name: "Castellano", $year: 2 }, // 7
		{ $name: "Ingles", $year: 2 }, // 8
		{ $name: "Educacion Fisica", $year: 3 }, // 9
		{ $name: "Musica", $year: 3 }, // 10
		{ $name: "Matematica", $year: 3 }, // 11
		{ $name: "Quimica", $year: 3 }, // 12
	];

	const charges: ChargeToInsert[] = [
		{ $period_id: 1, $course_id: 1, $teacher_id: 1 }, // year: 1
		{ $period_id: 1, $course_id: 2, $teacher_id: 6 }, // year: 1
		{ $period_id: 1, $course_id: 3, $teacher_id: 3 }, // year: 1
		{ $period_id: 2, $course_id: 1, $teacher_id: 2 }, // year: 1
		{ $period_id: 2, $course_id: 2, $teacher_id: 3 }, // year: 1
		{ $period_id: 2, $course_id: 4, $teacher_id: 5 }, // year: 1
		{ $period_id: 3, $course_id: 2, $teacher_id: 2 }, // year: 1
		{ $period_id: 3, $course_id: 3, $teacher_id: 4 }, // year: 1
		{ $period_id: 2, $course_id: 5, $teacher_id: 4 }, // year: 2
		{ $period_id: 3, $course_id: 6, $teacher_id: 3 }, // year: 2
		{ $period_id: 3, $course_id: 8, $teacher_id: 1 }, // year: 2
		{ $period_id: 2, $course_id: 10, $teacher_id: 1 }, // year: 3
	];

	const qualifications: QualificationToInsert[] = [
		{ $value: 19, $section: 1, $lapse: 1, $student_id: 1, $charge_id: 1 },
		{ $value: 20, $section: 1, $lapse: 1, $student_id: 1, $charge_id: 2 },
		{ $value: 12, $section: 1, $lapse: 1, $student_id: 1, $charge_id: 3 },
		{ $value: 19, $section: 1, $lapse: 1, $student_id: 2, $charge_id: 4 },
		{ $value: 18, $section: 1, $lapse: 1, $student_id: 2, $charge_id: 5 },
		{ $value: 9, $section: 1, $lapse: 1, $student_id: 2, $charge_id: 6 },
		{ $value: 15, $section: 1, $lapse: 1, $student_id: 3, $charge_id: 8 },
		{ $value: 12, $section: 1, $lapse: 1, $student_id: 3, $charge_id: 7 },
		{ $value: 8, $section: 1, $lapse: 1, $student_id: 4, $charge_id: 10 },
		{ $value: 15, $section: 1, $lapse: 1, $student_id: 4, $charge_id: 11 },
		{ $value: 1, $section: 1, $lapse: 1, $student_id: 5, $charge_id: 12 },
		{ $value: 16, $section: 1, $lapse: 1, $student_id: 6, $charge_id: 9 },
	];

	const periodResults = await insertPeriodTransaction(periods);
	const courseResults = await insertCourseTransaction(courses);
	const chargeResults = await insertChargeTransaction(charges);
	const qualificationResults =
		await insertQualificationTransaction(qualifications);

	return { periodResults, courseResults, chargeResults, qualificationResults };
}
