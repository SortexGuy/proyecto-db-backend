import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import {
	qualificationRepository,
	studentRepository,
	userRepository,
} from "@/dependencies";
import { newStudentSchema, updatedStudentSchema } from "@/models/student";
import { zValidator } from "@hono/zod-validator";
import { authValidator } from "@/utils/authValidator";

const student = new Hono();

student.get("/:ic/qualifications", async (c) => {
	const ic = c.req.param("ic");

	const qualifications =
		await qualificationRepository.getStudentFinalGrades(ic);
	if (!qualifications) {
		throw new HTTPException(404, { message: "Student not found" });
	}

	return c.json(qualifications);
});

student.get("/:id", async (c) => {
	const id = c.req.param("id");
	const foundStudent = await studentRepository.getStudentById(id);
	if (!foundStudent) {
		throw new HTTPException(404, { message: "Student not found" });
	}

	return c.json(foundStudent);
});

student.get("/", async (c) => {
	const foundStudents = await studentRepository.getAllStudents();

	if (!foundStudents) {
		throw new HTTPException(404, { message: "Students not found" });
	}

	return c.json(foundStudents);
});

student.post("/", zValidator("json", newStudentSchema), async (c) => {
	await authValidator(userRepository, c, "coordinator");
	const studentData = c.req.valid("json");

	studentRepository.aggregateStudent(studentData);
	return c.json({ message: "student created successfully" });
});

student.put("/:id", zValidator("json", updatedStudentSchema), async (c) => {
	await authValidator(userRepository, c, "coordinator");
	const id = c.req.param("id");
	const studentData = c.req.valid("json");

	studentRepository.updateStudent(parseInt(id), studentData);
	return c.json({ message: "student updated successfully" });
});

export default student;
