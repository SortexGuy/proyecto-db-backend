import { NewTeacher, Teacher, UpdatedTeacher } from "@/models/teacher";
import { ExtCharge, NewCharge } from "@/models/charge";

export interface TeacherRepository {
	getTeacherByUserId(id: string): Promise<Teacher | null>;
	getAllTeachers(): Promise<Teacher[]>;
	getExtChargeById(id: string): Promise<ExtCharge | null>;
	getTeacherAcademicChargesByTeacherId(id: string): Promise<ExtCharge[]>;
	aggregateTeacher(teacher: NewTeacher): Promise<void>;
	asignNewCharge(charge: NewCharge): void;
	updateTeacher(id: number, teacher: UpdatedTeacher): void;
}
