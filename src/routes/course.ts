import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { courseRepository } from "../dependencies";

const course = new Hono();

course.get("/:id", async (c) => {
  const id = c.req.param("id");
  const foundCourse = await courseRepository.getCourseById(id);
  if (!foundCourse) {
    throw new HTTPException(404, { message: "Course not found" });
  }

  return c.json(foundCourse);
});

export default course;
