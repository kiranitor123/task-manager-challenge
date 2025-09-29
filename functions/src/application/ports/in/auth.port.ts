import {User} from "../../../domain/entities/user.entity";

export interface CreateUserCommand {
    email: string;
}

export interface FindUserQuery {
    email: string;
}

export interface AuthPort {
    createUser(command: CreateUserCommand): Promise<User>;
    findUserByEmail(query: FindUserQuery): Promise<User | null>;
}
