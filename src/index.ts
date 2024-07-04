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

const app = new Hono();

app.use("*", logger());
app.route("/auth", auth);
app.route("/users", user);
app.route("/coordinators", coordinator);
app.route("/teachers", teacher);
app.route("/representatives", representative);
app.route("/students", student);
app.route("/courses", course);
app.route("/qualifications", qualification);
app.route("/periods", period);

app.get("/", async (c) => {
  return c.text("Hello World!");
});

// Test validation step
const listQuerySquema = z.object({
  section: z.coerce.number(),
  id_period: z.coerce.number(),
  id_course: z.coerce.number(),
});

app.get("/list", zValidator("query", listQuerySquema), async (c) => {
  const { section, id_period, id_course } = c.req.valid("query");

  return c.json({ section, id_period, id_course });
});

export default {
  port: 3000,
  fetch: app.fetch,
};
