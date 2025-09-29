import { Observable } from 'rxjs';
import { Task } from '../entities/task.entity';

export abstract class TaskRepository {
  abstract getTasksByUserId(userId: string): Observable<Task[]>;
  abstract createTask(task: Task): Observable<Task>;
  abstract updateTask(task: Task): Observable<Task>;
  abstract deleteTask(taskId: string, userId: string): Observable<void>;
  abstract getTaskById(taskId: string): Observable<Task | null>;
}