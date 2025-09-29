import {Task} from "../../../domain/entities/task.entity";

export interface CreateTaskCommand {
  userId: string;
  title: string;
  description: string;
}

export interface UpdateTaskCommand {
  taskId: string;
  userId: string;
  title?: string;
  description?: string;
  completed?: boolean;
}

export interface GetTasksQuery {
  userId: string;
}

export interface DeleteTaskCommand {
  taskId: string;
  userId: string;
}

export interface TaskPort {
  createTask(command: CreateTaskCommand): Promise<Task>;
  getTasks(query: GetTasksQuery): Promise<Task[]>;
  updateTask(command: UpdateTaskCommand): Promise<Task>;
  deleteTask(command: DeleteTaskCommand): Promise<void>;
}
