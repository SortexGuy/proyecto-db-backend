import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { teacherRepository } from "../dependencies";
import { userRepository } from "../dependencies";
import { authValidator } from "@/utils/authValidator";

const teacher = new Hono();

teacher.get("/me", async (c) => {
  const userTeacher = await authValidator(userRepository, c, "teacher");

  const teacherData = await teacherRepository.getTeacherByUserId(
    userTeacher.id.toString()
  );

  return c.json(teacherData);
});

teacher.get("/:id", async (c) => {
  const id = c.req.param("id");
  const foundTeacher = await teacherRepository.getTeacherByUserId(id);
  if (!foundTeacher) {
    throw new HTTPException(404, { message: "Teacher not found" });
  }

  return c.json(foundTeacher);
});

export default teacher;
