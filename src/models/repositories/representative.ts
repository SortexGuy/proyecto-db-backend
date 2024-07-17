import {
	NewRepresentative,
	Representative,
	UpdatedRepresentative,
} from "@/models/representative";
import { Student } from "@/models/student";

export interface RepresentativeRepository {
	getRepresentativeByUserId(id: string): Promise<Representative | null>;
	getAllRepresentatives(): Promise<Representative[]>;
	getStudentsByRepresentativeId(id: string): Promise<Student[]>;
	aggregateRepresentative(representative: NewRepresentative): Promise<void>;
	aggregateStudentToRepresentative(
		rep_user_id: string,
		student_ic: string,
	): Promise<void>;
	updateRepresentative(id: number, representative: UpdatedRepresentative): void;
}
