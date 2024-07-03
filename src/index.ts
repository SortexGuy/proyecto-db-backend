import { Hono } from "hono";
import { logger } from "hono/logger";
import auth from "./routes/auth";
import { Database } from "bun:sqlite";
import { BunUserRepository } from "./repositories/userRepository";
import { BunCoordinatorRepository } from "./repositories/coordinatorRepository";
import { BunTeacherRepository } from "./repositories/teacherRepository";
import { BunRepresentativeRepository } from "./repositories/representativeRepository";

const app = new Hono();

app.use("*", logger());
app.route("/auth", auth);

const db = new Database("./database/db.sqlite");
const userRepository = new BunUserRepository(db);
const coordinatorRepository = new BunCoordinatorRepository(db);
const teacherRepository = new BunTeacherRepository(db);
const representativeRepository = new BunRepresentativeRepository(db);

app.get("/", async (c) => {
  console.log(await userRepository.getUserById("1"));
  console.log(await coordinatorRepository.getCoordinatorByUserId("1"));
  console.log(await teacherRepository.getTeacherByUserId("1"));
  console.log(await representativeRepository.getRepresentativeByUserId("1"));
  return c.text("Hello World!");
});

export default {
  port: 3000,
  fetch: app.fetch,
};
