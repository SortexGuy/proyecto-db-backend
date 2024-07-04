import { Qualification } from "@/models/qualification";

export interface QualificationRepository {
	getQualificationById(id: string): Promise<Qualification | null>;
}
