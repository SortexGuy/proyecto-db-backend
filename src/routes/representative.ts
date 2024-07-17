import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { representativeRepository } from "../dependencies";
import { userRepository } from "../dependencies";
import { authValidator } from "@/utils/authValidator";
import { zValidator } from "@hono/zod-validator";
import {
	newRepresentativeSchema,
	updatedRepresentativeSchema,
} from "@/models/representative";
import { newRepStudentSchema } from "@/models/repStudent";

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

representative.get("/", async (c) => {
	const foundRepresentatives =
		await representativeRepository.getAllRepresentatives();

	if (!foundRepresentatives) {
		throw new HTTPException(404, { message: "Representatives not found" });
	}

	return c.json(foundRepresentatives);
});

representative.get("/:id/students", async (c) => {
	const id = c.req.param("id");
	const foundRepresentative =
		await representativeRepository.getRepresentativeByUserId(id);
	if (!foundRepresentative) {
		throw new HTTPException(404, { message: "Representative not found" });
	}

	const studentsData =
		await representativeRepository.getStudentsByRepresentativeId(
			foundRepresentative.id.toString(),
		);

	return c.json(studentsData);
});

representative.post(
	"/",
	zValidator("json", newRepresentativeSchema),
	async (c) => {
		await authValidator(userRepository, c, "coordinator");
		const representativeData = c.req.valid("json");

		representativeData.password = Bun.password.hashSync(
			representativeData.password,
			{ algorithm: "bcrypt" },
		);
		representativeRepository.aggregateRepresentative(representativeData);

		return c.json({ message: "representative created successfully" });
	},
);

representative.post(
	"/students",
	zValidator("json", newRepStudentSchema),
	async (c) => {
		await authValidator(userRepository, c, "coordinator");
		const repStudentData = c.req.valid("json");

		await representativeRepository.aggregateStudentToRepresentative(
			repStudentData,
		);
		return c.json({ message: "relationship created successfully" });
	},
);

representative.put(
	"/:id",
	zValidator("json", updatedRepresentativeSchema),
	async (c) => {
		await authValidator(userRepository, c, "coordinator");
		const id = c.req.param("id");
		const representativeData = c.req.valid("json");

		representativeRepository.updateRepresentative(
			parseInt(id),
			representativeData,
		);
		return c.json({ message: "student updated successfully" });
	},
);

export default representative;
