import {
	Coordinator,
	NewCoordinator,
	UpdatedCoordinator,
} from "@/models/coordinator";

export interface CoordinatorRepository {
	getCoordinatorByUserId(id: string): Promise<Coordinator | null>;
	aggregateCoordinator(coordinator: NewCoordinator): Promise<void>;
	updateCoordinator(id: number, coordinator: UpdatedCoordinator): void;
}
