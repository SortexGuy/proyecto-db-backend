import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { teacherRepository } from "../dependencies";
import { userRepository } from "../dependencies";
import { authValidator } from "@/utils/authValidator";
import { zValidator } from "@hono/zod-validator";
import { chargeSchema, extChargeSchema } from "@/models/charge";
import { z } from "zod";

const teacher = new Hono();

teacher.get("/me", async (c) => {
	const userTeacher = await authValidator(userRepository, c, "teacher");

	const teacherData = await teacherRepository.getTeacherByUserId(
		userTeacher.id.toString(),
	);

	return c.json(teacherData);
});

teacher.get("/:id", async (c) => {
	const id = c.req.param("id");
	const foundTeacher = await teacherRepository.getTeacherByUserId(id);
	if (!foundTeacher) {
		throw new HTTPException(404, { message: "Teacher not found" });
	}

	return c.json(foundTeacher);
});

teacher.get("/", async (c) => {
	const foundTeachers = await teacherRepository.getAllTeachers();

	if (!foundTeachers) {
		throw new HTTPException(404, { message: "Teachers not found" });
	}

	return c.json(foundTeachers);
});

teacher.get("/:id/charges", async (c) => {
	const id = c.req.param("id");
	const foundTeacher = await teacherRepository.getTeacherByUserId(id);

	if (!foundTeacher) {
		throw new HTTPException(404, { message: "Teacher not found" });
	}

	const foundCharges =
		await teacherRepository.getTeacherAcademicChargesByTeacherId(
			foundTeacher.id.toString(),
		);

	if (foundCharges.length === 0) {
		throw new HTTPException(404, {
			message: "No academic charges found for teacher",
		});
	}

	return c.json(foundCharges);
});

const newChargeSchema = chargeSchema.omit({ id: true });

teacher.post("/:id/charges", zValidator("json", newChargeSchema), async (c) => {
		const userCoordinator = await authValidator(userRepository, c, "coordinator");

		const id = c.req.param("id");
		const foundTeacher = await teacherRepository.getTeacherByUserId(id);

		if (!foundTeacher) {
			throw new HTTPException(404, { message: "Teacher not found" });
		}

		const chargeData = c.req.valid("json");

		chargeData.teacher_id = foundTeacher.id;
		teacherRepository.asignNewCharge(chargeData);

		return c.json({ message: "Charge added successfully" });
	},
);

export default teacher;
