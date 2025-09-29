import {Task} from "../../../domain/entities/task.entity";
import {UserId} from "../../../domain/value-objects/user-id.vo";
import {TaskValidationService} from "../../../domain/services/task-validation.service";
import {TaskRepositoryPort} from "../../ports/out/task.repository.port";
import {UserRepositoryPort} from "../../ports/out/user.repository.port";
import {LoggerPort} from "../../ports/out/logger.port";
import {UserNotFoundException} from "../../../domain/exceptions/user-not-found.exception";

export class CreateTaskUseCase {
  constructor(
    private readonly taskRepository: TaskRepositoryPort,
    private readonly userRepository: UserRepositoryPort,
    private readonly logger: LoggerPort
  ) {}

  async execute(userId: string, title: string, description: string): Promise<Task> {
    this.logger.info("Creating task", {userId, title});

    try {
      // Validate input data
      TaskValidationService.validateTaskData(title, description);

      // Verify user exists
      const userIdVO = UserId.fromString(userId);
      const user = await this.userRepository.findById(userIdVO);
      if (!user) {
        throw new UserNotFoundException(userId);
      }

      // Create task
      const task = Task.create(userId, title, description);
      const savedTask = await this.taskRepository.save(task);

      this.logger.info("Task created successfully", {
        taskId: savedTask.id.value,
        userId: savedTask.userId.value,
      });

      return savedTask;
    } catch (error) {
      this.logger.error("Failed to create task", error as Error, {userId, title});
      throw error;
    }
  }
}
