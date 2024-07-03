import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { representativeRepository } from "../dependencies";

const representative = new Hono();

representative.get("/:id", async (c) => {
  const id = c.req.param("id");
  const foundRepresentative =
    await representativeRepository.getRepresentativeByUserId(id);
  if (!foundRepresentative) {
    throw new HTTPException(404, { message: "Representative not found" });
  }

  return c.json({
    id: foundRepresentative.id,
    ic: foundRepresentative.ic,
    name: foundRepresentative.name,
    last_name: foundRepresentative.last_name,

    user_id: foundRepresentative.user_id,
  });
});

export default representative;
