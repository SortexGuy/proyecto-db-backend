import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { studentRepository } from "../dependencies";

const student = new Hono();

student.get("/:id", async (c) => {
  const id = c.req.param("id");
  const foundStudent = await studentRepository.getStudentById(id);
  if (!foundStudent) {
    throw new HTTPException(404, { message: "Student not found" });
  }

  return c.json({
    id: foundStudent.id,
    ic: foundStudent.ic,
    name: foundStudent.name,
  });
});

export default student;
