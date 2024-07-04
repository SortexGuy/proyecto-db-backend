import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { qualificationRepository } from "../dependencies";

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

export default qualification;
