import { Hono } from "hono";
import { logger } from "hono/logger";
import auth from "./routes/auth";

const app = new Hono();

app.use("*", logger());
app.route("/auth", auth);

app.get("/", async (c) => {
  return c.text("Hello World!");
});

export default {
  port: 3000,
  fetch: app.fetch,
};
