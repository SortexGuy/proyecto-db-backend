import { Coordinator, NewCoordinator } from "@/models/coordinator";

export interface CoordinatorRepository {
	getCoordinatorByUserId(id: string): Promise<Coordinator | null>;
	aggregateCoordinator(coordinator: NewCoordinator): Promise<void>;
}
