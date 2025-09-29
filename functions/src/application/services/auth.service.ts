import {User} from "../../domain/entities/user.entity";
import {CreateUserUseCase} from "../use-cases/auth/create-user.use-case";
import {FindUserUseCase} from "../use-cases/auth/find-user.use-case";
import {AuthPort, CreateUserCommand, FindUserQuery} from "../ports/in/auth.port";

export class AuthService implements AuthPort {
  constructor(
        private readonly createUserUseCase: CreateUserUseCase,
        private readonly findUserUseCase: FindUserUseCase
  ) { }

  async createUser(command: CreateUserCommand): Promise<User> {
    return await this.createUserUseCase.execute(command.email);
  }

  async findUserByEmail(query: FindUserQuery): Promise<User | null> {
    try {
      return await this.findUserUseCase.execute(query.email);
    } catch (error) {
      // Return null for UserNotFoundException to allow user creation flow
      if ((error as Error).name === "UserNotFoundException") {
        return null;
      }
      throw error;
    }
  }
}
