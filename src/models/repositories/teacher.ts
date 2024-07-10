import { Teacher } from "@/models/teacher";
import { ExtCharge } from "@/models/charge";

export interface TeacherRepository {
	getTeacherByUserId(id: string): Promise<Teacher | null>;
	getTeacherAcademicChargesByTeacherId(id: string): Promise<ExtCharge[]>;
}
