import {User} from "../../../domain/entities/user.entity";
import {Email} from "../../../domain/value-objects/email.vo";
import {UserNotFoundException} from "../../../domain/exceptions/user-not-found.exception";
import {UserRepositoryPort} from "../../ports/out/user.repository.port";
import {LoggerPort} from "../../ports/out/logger.port";

export class FindUserUseCase {
  constructor(
        private readonly userRepository: UserRepositoryPort,
        private readonly logger: LoggerPort
  ) { }

  async execute(email: string): Promise<User> {
    this.logger.info("Finding user by email", {email});

    try {
      const emailVO = Email.create(email);
      const user = await this.userRepository.findByEmail(emailVO);
      if (!user) {
        throw new UserNotFoundException(email);
      }

      this.logger.info("User found", {userId: user.id.value});
      return user;
    } catch (error) {
      this.logger.error("Failed to find user", error as Error, {email});
      throw error;
    }
  }
}
