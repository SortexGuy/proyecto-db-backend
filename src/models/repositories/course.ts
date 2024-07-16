import { Course, NewCourse, UpdatedCourse } from "@/models/course";

export interface CourseRepository {
	getCourseById(id: string): Promise<Course | null>;
	getAllCourses(): Promise<Course[]>;
	createCourse(course: NewCourse): void;
	updateCourse(id: number, course: UpdatedCourse): void;
}
