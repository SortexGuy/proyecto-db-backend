import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { representativeRepository } from "../dependencies";
import { userRepository } from "../dependencies";
import { authValidator } from "@/utils/authValidator";

const representative = new Hono();

representative.get("/me", async (c) => {
	const userRepresentative = await authValidator(
		userRepository,
		c,
		"representative",
	);

	const representativeData =
		await representativeRepository.getRepresentativeByUserId(
			userRepresentative.id.toString(),
		);

	return c.json(representativeData);
});

representative.get("/me/students", async (c) => {
	const userRepresentative = await authValidator(
		userRepository,
		c,
		"representative",
	);

	const representativeData =
		await representativeRepository.getRepresentativeByUserId(
			userRepresentative.id.toString(),
		);

	if (!representativeData) {
		throw new HTTPException(403, { message: "Unauthorized" });
	}

	const studentsData =
		await representativeRepository.getStudentsByRepresentativeId(
			representativeData.id.toString(),
		);

	return c.json(studentsData);
});

representative.get("/:id", async (c) => {
	const id = c.req.param("id");
	const foundRepresentative =
		await representativeRepository.getRepresentativeByUserId(id);
	if (!foundRepresentative) {
		throw new HTTPException(404, { message: "Representative not found" });
	}

	return c.json(foundRepresentative);
});

representative.get("/:id/students", async (c) => {
	// TODO: Implement this
});

export default representative;
