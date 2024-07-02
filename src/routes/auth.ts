import { Hono } from "hono";

const auth = new Hono();

auth.get("/", (c) => {
  return c.text("Hello, world!");
});

export default auth;
