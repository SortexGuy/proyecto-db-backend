import { Hono } from "hono";
import { logger } from "hono/logger";
import auth from "./routes/auth";
import user from "./routes/user";
import coordinator from "./routes/coordinator";
import teacher from "./routes/teacher";
import representative from "./routes/representative";
import student from "./routes/student";
import course from "./routes/course";
import qualification from "./routes/qualification";
import period from "./routes/period";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { HTTPException } from "hono/http-exception";
import { cors } from "hono/cors";

const app = new Hono();

app.use("*", logger());
app.use("*", cors());

app.onError(async (error, c) => {
	if (!(error instanceof HTTPException)) {
		c.status(500);
		return c.json({
			error: {
				status: 500,
				name: "Internal Server Error",
				message: "Internal Server Error",
			},
		});
	}

	c.status(error.status);
	return c.json({
		error: {
			status: error.status,
			name: error.name,
			message: error.message,
		},
	});
});

app.route("/auth", auth);
app.route("/users", user);
app.route("/coordinators", coordinator);
app.route("/teachers", teacher);
app.route("/representatives", representative);
app.route("/students", student);
app.route("/courses", course);
app.route("/qualifications", qualification);
app.route("/periods", period);

export default {
	port: 3000,
	fetch: app.fetch,
};
