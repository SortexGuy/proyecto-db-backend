import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { qualificationRepository, userRepository } from "../dependencies";
import { zValidator } from "@hono/zod-validator";
import {
	newQualificationSchema,
	searchQualificationSchema,
	updatedQualificationSchema,
} from "@/models/qualification";
import { authValidator } from "@/utils/authValidator";

const qualification = new Hono();

qualification.get(
	"/search",
	zValidator("query", searchQualificationSchema),
	async (c) => {
		const searchQualification = c.req.valid("query");
		console.log(searchQualification);

		const foundQualification =
			await qualificationRepository.searchQualification(searchQualification);

		return c.json(foundQualification);
	},
);

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
		await authValidator(userRepository, c, "coordinator");
		const studentData = c.req.valid("json");

		qualificationRepository.aggregateQualification(studentData);
		return c.json({ message: "student created successfully" });
	},
);

qualification.put(
	"/:id",
	zValidator("json", updatedQualificationSchema),
	async (c) => {
		await authValidator(userRepository, c, "coordinator");
		const id = c.req.param("id");
		const qualificationData = c.req.valid("json");

		qualificationRepository.updateQualification(
			parseInt(id),
			qualificationData,
		);
		return c.json({ message: "qualification updated successfully" });
	},
);

export default qualification;
