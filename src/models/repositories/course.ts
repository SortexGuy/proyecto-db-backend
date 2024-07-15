import { Course, NewCourse } from "@/models/course";

export interface CourseRepository {
	getCourseById(id: string): Promise<Course | null>;
	getAllCourses(): Promise<Course[]>;
	createCourse(course: NewCourse): void;
}
