import { Context } from "hono";
import { env } from "@/env";
import { verify } from "hono/jwt";
import { getCookie } from "hono/cookie";
import { HTTPException } from "hono/http-exception";
import { User } from "@/models/user";
import { UserRepository } from "@/models/repositories/user";
import { z } from "zod";

type UserRole = User["role"];
type UserWithRole<T extends UserRole> = User & {
	role: T;
};

export const authValidator = async <T extends UserRole>(
	userRepository: UserRepository,
	c: Context,
	role?: T,
): Promise<UserWithRole<T>> => {
	const token = getCookie(c, "token");

	if (!token) {
		throw new HTTPException(401, {
			message: "Token not found",
		});
	}

	const decoded = await verify(token, env.JWT_SECRET).catch(() => {
		throw new HTTPException(401, {
			message: "Invalid token",
		});
	});

	const parsedPayload = await z
		.object({
			sub: z.number(),
			exp: z.number(),
		})
		.parseAsync(decoded)
		.catch(() => {
			throw new HTTPException(401, {
				message: "Invalid token",
			});
		});

	const id = parsedPayload.sub.toString();

	const user = await userRepository.getUserById(id);

	if (!user) {
		throw new HTTPException(401, {
			message: "Unauthorized",
		});
	}

	if (role && user.role !== role) {
		throw new HTTPException(401, {
			message: `You must be a ${role} to perform this action`,
		});
	}

	return user as UserWithRole<T>;
};
