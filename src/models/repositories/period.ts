import { Period } from "@/models/period";

export interface PeriodRepository {
  getPeriodById(id: string): Promise<Period | null>;
}
