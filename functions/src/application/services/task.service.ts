import {Task} from "../../domain/entities/task.entity";
import {CreateTaskUseCase} from "../use-cases/tasks/create-task.use-case";
import {GetTasksUseCase} from "../use-cases/tasks/get-tasks.use-case";
import {UpdateTaskUseCase} from "../use-cases/tasks/update-task.use-case";
import {DeleteTaskUseCase} from "../use-cases/tasks/delete-task.use-case";
import {TaskPort, CreateTaskCommand, UpdateTaskCommand, GetTasksQuery, DeleteTaskCommand} from "../ports/in/task.port";
import {GetTaskUseCase} from "../use-cases/tasks/get-task.use-case";

export class TaskService implements TaskPort {
  constructor(
        private readonly createTaskUseCase: CreateTaskUseCase,
        private readonly getTasksUseCase: GetTasksUseCase,
        private readonly getTaskUseCase: GetTaskUseCase,
        private readonly updateTaskUseCase: UpdateTaskUseCase,
        private readonly deleteTaskUseCase: DeleteTaskUseCase
  ) { }

  async createTask(command: CreateTaskCommand): Promise<Task> {
    return await this.createTaskUseCase.execute(
      command.userId,
      command.title,
      command.description
    );
  }

  async getTasks(query: GetTasksQuery): Promise<Task[]> {
    return await this.getTasksUseCase.execute(query.userId);
  }

  async getTaskById(taskId: string): Promise<Task | null> {
    return await this.getTaskUseCase.execute(taskId);
  }

  async updateTask(command: UpdateTaskCommand): Promise<Task> {
    return await this.updateTaskUseCase.execute({
      taskId: command.taskId,
      userId: command.userId,
      title: command.title,
      description: command.description,
      completed: command.completed,
    });
  }

  async deleteTask(command: DeleteTaskCommand): Promise<void> {
    return await this.deleteTaskUseCase.execute(command.taskId, command.userId);
  }
}
