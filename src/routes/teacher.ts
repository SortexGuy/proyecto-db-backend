import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { teacherRepository } from "../dependencies";

const teacher = new Hono();

teacher.get("/:id", async (c) => {
  const id = c.req.param("id");
  const foundTeacher = await teacherRepository.getTeacherByUserId(id);
  if (!foundTeacher) {
    throw new HTTPException(404, { message: "Teacher not found" });
  }

  return c.json(foundTeacher);
});

export default teacher;
