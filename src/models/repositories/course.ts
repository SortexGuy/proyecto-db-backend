import { Course } from "@/models/course";

export interface CourseRepository {
	getCourseById(id: string): Promise<Course | null>;
	getAllCourses(): Promise<Course[]>;
	createCourse(course: any): void;
}
