import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { periodRepository, userRepository } from "../dependencies";
import { authValidator } from "@/utils/authValidator";
import { zValidator } from "@hono/zod-validator";
import { newPeriodSchema } from "@/models/period";

const period = new Hono();

period.get("/:id", async (c) => {
	const id = c.req.param("id");
	const foundPeriod = await periodRepository.getPeriodById(id);
	if (!foundPeriod) {
		throw new HTTPException(404, { message: "period not found" });
	}

	return c.json(foundPeriod);
});

period.get("/", async (c) => {
	const foundPeriods = await periodRepository.getAllPeriods();

	if (!foundPeriods) {
		throw new HTTPException(404, { message: "periods not found" });
	}

	return c.json(foundPeriods);
});

period.post("/", zValidator("json", newPeriodSchema), async (c) => {
	const userCoordinator = await authValidator(userRepository, c, "coordinator");

	const periodData = c.req.valid("json");

	periodRepository.createPeriod(periodData);

	return c.json({ message: "period created successfully" });
});

export default period;
