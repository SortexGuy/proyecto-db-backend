import { Student } from "@/models/student";

export interface StudentRepository {
	getStudentById(id: string): Promise<Student | null>;
}
