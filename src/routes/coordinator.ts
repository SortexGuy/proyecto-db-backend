import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { coordinatorRepository } from "../dependencies";

const coordinator = new Hono();

coordinator.get("/:id", async (c) => {
  const id = c.req.param("id");
  const foundCoordinator =
    await coordinatorRepository.getCoordinatorByUserId(id);
  if (!foundCoordinator) {
    throw new HTTPException(404, { message: "Coordinator not found" });
  }

  return c.json(foundCoordinator);
});

export default coordinator;
