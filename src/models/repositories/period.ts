import { NewPeriod, Period } from "@/models/period";

export interface PeriodRepository {
	getPeriodById(id: string): Promise<Period | null>;
	getAllPeriods(): Promise<Period[]>;
	createPeriod(period: NewPeriod): void;
}
