import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { qualificationRepository, userRepository } from "../dependencies";
import { zValidator } from "@hono/zod-validator";
import { newQualificationSchema } from "@/models/qualification";
import { authValidator } from "@/utils/authValidator";

const qualification = new Hono();

qualification.get("/:id", async (c) => {
	const id = c.req.param("id");
	const foundQualification =
		await qualificationRepository.getQualificationById(id);
	if (!foundQualification) {
		throw new HTTPException(404, { message: "Qualification not found" });
	}

	return c.json(foundQualification);
});

qualification.post(
	"/",
	zValidator("json", newQualificationSchema),
	async (c) => {
		const userCoordinator = await authValidator(
			userRepository,
			c,
			"coordinator",
		);

		const studentData = c.req.valid("json");

		qualificationRepository.aggregateQualification(studentData);

		return c.json({ message: "student created successfully" });
	},
);

export default qualification;
