import { Database } from "bun:sqlite";
import { BunUserRepository } from "./repositories/userRepository";
import { BunCoordinatorRepository } from "./repositories/coordinatorRepository";
import { BunTeacherRepository } from "./repositories/teacherRepository";
import { BunRepresentativeRepository } from "./repositories/representativeRepository";

export const db = new Database("./database/db.sqlite");
export const userRepository = new BunUserRepository(db);
export const coordinatorRepository = new BunCoordinatorRepository(db);
export const teacherRepository = new BunTeacherRepository(db);
export const representativeRepository = new BunRepresentativeRepository(db);
