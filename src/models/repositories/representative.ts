import { Representative } from "@/models/representative";
import { Student } from "@/models/student";

export interface RepresentativeRepository {
	getRepresentativeByUserId(id: string): Promise<Representative | null>;
	getStudentsByRepresentativeId(id: string): Promise<Student[]>;
}
