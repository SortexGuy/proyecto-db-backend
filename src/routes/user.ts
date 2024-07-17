import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { userRepository } from "../dependencies";
import { authValidator } from "@/utils/authValidator";
import { updatedUserSchema } from "@/models/user";
import { zValidator } from "@hono/zod-validator";

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

user.put("/:id", zValidator("json", updatedUserSchema), async (c) => {
	await authValidator(userRepository, c, "coordinator");
	const id = c.req.param("id");
	const userData = c.req.valid("json");

	if (userData.hasOwnProperty("password")) {
		userData.password = Bun.password.hashSync(userData.password!, {
			algorithm: "bcrypt",
		});
	}
	userRepository.updateUser(parseInt(id), userData);
	return c.json({ message: "user updated successfully" });
});

export default user;
