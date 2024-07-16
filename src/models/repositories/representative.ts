import { NewRepresentative, Representative } from "@/models/representative";
import { Student } from "@/models/student";
import { NewRepStudent } from "@/models/repStudent";

export interface RepresentativeRepository {
	getRepresentativeByUserId(id: string): Promise<Representative | null>;
	getAllRepresentatives(): Promise<Representative[]>;
	getStudentsByRepresentativeId(id: string): Promise<Student[]>;
	aggregateRepresentative(representative: NewRepresentative): Promise<void>;
	aggregateStudentToRepresentative(repStudent: NewRepStudent): Promise<void>;
}
