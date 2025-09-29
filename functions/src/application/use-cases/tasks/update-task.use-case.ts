import {Task} from "../../../domain/entities/task.entity";
import {TaskId} from "../../../domain/value-objects/task-id.vo";
import {TaskNotFoundException} from "../../../domain/exceptions/task-not-found.exception";
import {TaskValidationService} from "../../../domain/services/task-validation.service";
import {TaskRepositoryPort} from "../../ports/out/task.repository.port";
import {LoggerPort} from "../../ports/out/logger.port";

export interface UpdateTaskParams {
    taskId: string;
    userId: string;
    title?: string;
    description?: string;
    completed?: boolean;
}

export class UpdateTaskUseCase {
  constructor(
        private readonly taskRepository: TaskRepositoryPort,
        private readonly logger: LoggerPort
  ) { }

  async execute(params: UpdateTaskParams): Promise<Task> {
    this.logger.info("Updating task", {taskId: params.taskId, userId: params.userId});

    try {
      // Get existing task
      console.log("Updating task with params:", params);
      const taskIdVO = TaskId.fromString(params.taskId);
      const task = await this.taskRepository.findById(taskIdVO);

      if (!task) {
        throw new TaskNotFoundException(params.taskId);
      }

      // Verify ownership
      if (!TaskValidationService.canUserAccessTask(task, params.userId)) {
        throw new Error("Access denied: Task does not belong to user");
      }

      // Update task properties
      if (params.title !== undefined) {
        task.updateTitle(params.title);
      }

      if (params.description !== undefined) {
        task.updateDescription(params.description);
      }

      if (params.completed !== undefined) {
        if (params.completed) {
          task.markAsCompleted();
        } else {
          task.markAsPending();
        }
      }

      // Save updated task
      const updatedTask = await this.taskRepository.update(task);

      this.logger.info("Task updated successfully", {
        taskId: updatedTask.id.value,
        userId: params.userId,
      });

      return updatedTask;
    } catch (error) {
      this.logger.error("Failed to update task", error as Error, params);
      throw error;
    }
  }
}
