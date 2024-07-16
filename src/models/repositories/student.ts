import { NewStudent, Student, UpdatedStudent } from "@/models/student";

export interface StudentRepository {
	getStudentById(id: string): Promise<Student | null>;
	getAllStudents(): Promise<Student[]>;
	aggregateStudent(student: NewStudent): void;
	updateStudent(id: number, student: UpdatedStudent): void;
}
