import {TaskId} from "../../../domain/value-objects/task-id.vo";
import {TaskNotFoundException} from "../../../domain/exceptions/task-not-found.exception";
import {TaskValidationService} from "../../../domain/services/task-validation.service";
import {TaskRepositoryPort} from "../../ports/out/task.repository.port";
import {LoggerPort} from "../../ports/out/logger.port";

export class DeleteTaskUseCase {
  constructor(
        private readonly taskRepository: TaskRepositoryPort,
        private readonly logger: LoggerPort
  ) { }

  async execute(taskId: string, userId: string): Promise<void> {
    this.logger.info("Deleting task", {taskId, userId});

    try {
      // Get existing task
      const taskIdVO = TaskId.fromString(taskId);
      const task = await this.taskRepository.findById(taskIdVO);

      if (!task) {
        throw new TaskNotFoundException(taskId);
      }

      // Verify ownership
      if (!TaskValidationService.canUserAccessTask(task, userId)) {
        throw new Error("Access denied: Task does not belong to user");
      }

      // Delete task
      await this.taskRepository.delete(taskIdVO);

      this.logger.info("Task deleted successfully", {taskId, userId});
    } catch (error) {
      this.logger.error("Failed to delete task", error as Error, {taskId, userId});
      throw error;
    }
  }
}
