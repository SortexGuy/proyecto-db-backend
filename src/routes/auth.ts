import { userRepository } from "@/dependencies";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";
import { sign } from "hono/jwt";
import { env } from "@/env";
import { setCookie } from "hono/cookie";

const auth = new Hono();

auth.post(
	"/login",
	zValidator(
		"json",
		z.object({
			username: z.string(),
			password: z.string(),
		}),
	),
	async (c) => {
		const { username, password } = c.req.valid("json");

		const foundUser = await userRepository.getUserByUsername(username);

		if (!foundUser) {
			throw new HTTPException(401, { message: "Invalid credentials" });
		}

		const passwordMatch = Bun.password.verifySync(password, foundUser.password);

		if (!passwordMatch) {
			throw new HTTPException(401, { message: "Invalid credentials" });
		}

		const payload = {
			sub: foundUser.id,
			exp: Math.floor(Date.now() / 1000) + 60 * 60,
		};

		const secret = env.JWT_SECRET;

		const token = await sign(payload, secret);

		setCookie(c, "token", token);

		return c.json({
			user: foundUser,
			token,
		});
	},
);

export default auth;
