import {Task} from "../../../domain/entities/task.entity";
import {TaskRepository} from "../../../infrastructure/adapters/persistence/task.repository";
import {LoggerPort} from "../../ports/out/logger.port";
import {TaskId} from "../../../domain/value-objects/task-id.vo";
import {TaskNotFoundException} from "../../../domain/exceptions/task-not-found.exception";

export class GetTaskUseCase {
  constructor(private readonly taskRepository: TaskRepository, private readonly logger: LoggerPort) {}

  async execute(taskId: string): Promise<Task | null> {
    this.logger.info("Get task by Id", {taskId});

    try {
      // Get existing task
      const taskIdVO = TaskId.fromString(taskId);
      const task = await this.taskRepository.findById(taskIdVO);

      if (!task) {
        throw new TaskNotFoundException(taskId);
      }

      this.logger.info("Task retrieved successfully", {taskId});
      return task;
    } catch (error) {
      this.logger.error("Failed to retrieve task", error as Error, {taskId});
      throw error;
    }
  }
}
