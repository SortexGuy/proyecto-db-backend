import { UpdatedUser, User } from "@/models/user";

export interface UserRepository {
	getUserById(id: string): Promise<User | null>;
	getUserByUsername(username: string): Promise<User | null>;
	updateUser(id: number, user: UpdatedUser): void;
}
