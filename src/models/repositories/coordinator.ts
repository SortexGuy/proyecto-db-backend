import { Coordinator } from "@/models/coordinator";

export interface CoordinatorRepository {
  getCoordinatorByUserId(id: string): Promise<Coordinator | null>;
}
