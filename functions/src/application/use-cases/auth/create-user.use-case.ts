import {User} from "../../../domain/entities/user.entity";
import {Email} from "../../../domain/value-objects/email.vo";
import {UserAlreadyExistsException} from "../../../domain/exceptions/user-already-exists.exception";
import {UserRepositoryPort} from "../../ports/out/user.repository.port";
import {LoggerPort} from "../../ports/out/logger.port";

export class CreateUserUseCase {
  constructor(
    private readonly userRepository: UserRepositoryPort,
    private readonly logger: LoggerPort
  ) {}

  async execute(email: string): Promise<User> {
    this.logger.info("Creating user", {email});

    try {
      const emailVO = Email.create(email);

      // Check if user already exists
      const existingUser = await this.userRepository.findByEmail(emailVO);
      if (existingUser) {
        throw new UserAlreadyExistsException(email);
      }

      // Create new user
      const user = User.create(email);
      const savedUser = await this.userRepository.save(user);

      this.logger.info("User created successfully", {
        userId: savedUser.id.value,
        email: savedUser.email.value,
      });

      return savedUser;
    } catch (error) {
      this.logger.error("Failed to create user", error as Error, {email});
      throw error;
    }
  }
}
