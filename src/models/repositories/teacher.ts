import { Teacher } from "@/models/teacher";

export interface TeacherRepository {
  getTeacherByUserId(id: string): Promise<Teacher | null>;
}
