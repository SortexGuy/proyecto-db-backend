import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { courseRepository, userRepository } from "../dependencies";
import { authValidator } from "@/utils/authValidator";

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

course.post("/", async (c) => {
	const userCoordinator = await authValidator(userRepository, c, "coordinator");

	const courseData = c.req.json();

	courseRepository.createCourse(courseData);

	return c.json({ message: "course created successfully" });
});

export default course;
