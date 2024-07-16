import { NewTeacher, Teacher } from "@/models/teacher";
import { ExtCharge, NewCharge } from "@/models/charge";

export interface TeacherRepository {
	getTeacherByUserId(id: string): Promise<Teacher | null>;
	getAllTeachers(): Promise<Teacher[]>;
	getTeacherAcademicChargesByTeacherId(id: string): Promise<ExtCharge[]>;
	aggregateTeacher(teacher: NewTeacher): Promise<void>;
	asignNewCharge(charge: NewCharge): void;
}
