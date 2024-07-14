import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { periodRepository } from "../dependencies";

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

export default period;
