import {Task} from "../../../domain/entities/task.entity";
import {UserId} from "../../../domain/value-objects/user-id.vo";
import {TaskRepositoryPort} from "../../ports/out/task.repository.port";
import {LoggerPort} from "../../ports/out/logger.port";

export class GetTasksUseCase {
  constructor(
        private readonly taskRepository: TaskRepositoryPort,
        private readonly logger: LoggerPort
  ) { }

  async execute(userId: string): Promise<Task[]> {
    this.logger.info("Getting tasks for user", {userId});

    try {
      const userIdVO = UserId.fromString(userId);
      const tasks = await this.taskRepository.findByUserId(userIdVO);

      this.logger.info("Tasks retrieved successfully", {
        userId,
        taskCount: tasks.length,
      });

      return tasks;
    } catch (error) {
      this.logger.error("Failed to get tasks", error as Error, {userId});
      throw error;
    }
  }
}
