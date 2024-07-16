import {
	ExtQualification,
	NewQualification,
	Qualification,
	UpdatedQualification,
} from "@/models/qualification";

export interface QualificationRepository {
	getQualificationById(id: string): Promise<Qualification | null>;
	getQualificationsByStudentId(id: string): Promise<ExtQualification[] | null>;
	aggregateQualification(qualification: NewQualification): void;
	updateQualification(id: number, qualification: UpdatedQualification): void;
}
