import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { userRepository } from "../dependencies";

const user = new Hono();

user.get("/:id", async (c) => {
  const id = c.req.param("id");
  const foundUser = await userRepository.getUserById(id);
  if (!foundUser) {
    throw new HTTPException(404, { message: "User not found" });
  }

  return c.json({
    id: foundUser.id,
    username: foundUser.username,
    password: foundUser.password,
    role: foundUser.role,
  });
});

export default user;
