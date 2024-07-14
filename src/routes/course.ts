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

course.get("/", async (c) => {
	const foundCourses = await courseRepository.getAllCourses();

	if (!foundCourses) {
		throw new HTTPException(404, { message: "Courses not found" });
	}

	return c.json(foundCourses);
});

export default course;
