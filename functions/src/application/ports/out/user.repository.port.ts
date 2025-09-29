import {User} from "../../../domain/entities/user.entity";
import {Email} from "../../../domain/value-objects/email.vo";
import {UserId} from "../../../domain/value-objects/user-id.vo";

export interface UserRepositoryPort {
    findByEmail(email: Email): Promise<User | null>;
    findById(id: UserId): Promise<User | null>;
    save(user: User): Promise<User>;
    exists(email: Email): Promise<boolean>;
}
