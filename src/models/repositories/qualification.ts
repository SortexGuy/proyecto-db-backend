import { ExtQualification, Qualification } from "@/models/qualification";

export interface QualificationRepository {
	getQualificationById(id: string): Promise<Qualification | null>;
	getQualificationsByStudentId(id: string): Promise<ExtQualification[] | null>;
}
