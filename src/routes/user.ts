import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { userRepository } from "../dependencies";
import { authValidator } from "@/utils/authValidator";

const user = new Hono();

user.get("/me", async (c) => {
	const user = await authValidator(userRepository, c);

	return c.json(user);
});

user.get("/:id", async (c) => {
	const id = c.req.param("id");
	const foundUser = await userRepository.getUserById(id);
	if (!foundUser) {
		throw new HTTPException(404, { message: "User not found" });
	}

	return c.json(foundUser);
});

export default user;
