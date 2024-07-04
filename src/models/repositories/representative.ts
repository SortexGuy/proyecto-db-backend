import { Representative } from "@/models/representative";

export interface RepresentativeRepository {
	getRepresentativeByUserId(id: string): Promise<Representative | null>;
}
