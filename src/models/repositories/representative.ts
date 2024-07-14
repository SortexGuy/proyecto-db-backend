import { Representative } from "@/models/representative";
import { Student } from "@/models/student";

export interface RepresentativeRepository {
	getRepresentativeByUserId(id: string): Promise<Representative | null>;
	getAllRepresentatives(): Promise<Representative[]>;
	getStudentsByRepresentativeId(id: string): Promise<Student[]>;
}
