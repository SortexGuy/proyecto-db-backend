import { NewPeriod, Period, UpdatedPeriod } from "@/models/period";

export interface PeriodRepository {
	getPeriodById(id: string): Promise<Period | null>;
	getAllPeriods(): Promise<Period[]>;
	createPeriod(period: NewPeriod): void;
	updatePeriod(id: number, period: UpdatedPeriod): void;
}
