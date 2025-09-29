import {Task} from "../entities/task.entity";

export class TaskValidationService {
  static validateTaskOwnership(task: Task, userId: string): boolean {
    return task.userId.value === userId;
  }

  static canUserAccessTask(task: Task, userId: string): boolean {
    return this.validateTaskOwnership(task, userId);
  }

  static validateTaskData(title: string, description: string): void {
    if (!title || title.trim().length < 3) {
      throw new Error("Task title must have at least 3 characters");
    }

    if (title.length > 100) {
      throw new Error("Task title must have maximum 100 characters");
    }

    if (!description || !description.trim()) {
      throw new Error("Task description cannot be empty");
    }

    if (description.length > 500) {
      throw new Error("Task description must have maximum 500 characters");
    }
  }
}
