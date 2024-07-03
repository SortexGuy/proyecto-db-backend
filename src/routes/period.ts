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

  return c.json({
    id: foundPeriod.id,
    start: foundPeriod.start,
    end: foundPeriod.end,
  });
});

export default period;
