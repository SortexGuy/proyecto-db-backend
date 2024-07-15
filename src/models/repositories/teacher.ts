import { Teacher } from "@/models/teacher";
import { ExtCharge, NewCharge } from "@/models/charge";

export interface TeacherRepository {
	getTeacherByUserId(id: string): Promise<Teacher | null>;
	getAllTeachers(): Promise<Teacher[]>;
	getTeacherAcademicChargesByTeacherId(id: string): Promise<ExtCharge[]>;
	asignNewCharge(charge: NewCharge): void;
}
