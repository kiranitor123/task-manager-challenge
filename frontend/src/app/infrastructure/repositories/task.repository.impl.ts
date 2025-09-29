import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { TaskRepository } from '../../domain/repositories/task.repository';
import { Task } from '../../domain/entities/task.entity';
import { TaskStatus } from '../../domain/value-objects/task-status.vo';
import { ApiAdapter } from '../adapters/api.adapter';

interface TaskDTO {
  id: string;
  userId: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TaskRepositoryImpl extends TaskRepository {
  constructor(private apiAdapter: ApiAdapter) {
    super();
  }

  getTasksByUserId(userId: string): Observable<Task[]> {
    return this.apiAdapter.get<TaskDTO[]>(`/tasks/user/${userId}`).pipe(
      map(response => {
        if (!response.success || !response.data) {
          throw new Error(response.error || 'Failed to get tasks');
        }
        return response.data.map(dto => this.mapDTOToEntity(dto));
      })
    );
  }

  createTask(task: Task): Observable<Task> {
    const dto = {
      userId: task.userId,
      title: task.title,
      description: task.description
    };

    return this.apiAdapter.post<TaskDTO>('/tasks', dto).pipe(
      map(response => {
        if (!response.success || !response.data) {
          throw new Error(response.error || 'Failed to create task');
        }
        return this.mapDTOToEntity(response.data);
      })
    );
  }

  updateTask(task: Task): Observable<Task> {
    const dto = {
      title: task.title,
      description: task.description,
      completed: task.isCompleted
    };

    return this.apiAdapter.put<TaskDTO>(`/tasks/${task.id}?userId=${task.userId}`, dto).pipe(
      map(response => {
        if (!response.success || !response.data) {
          throw new Error(response.error || 'Failed to update task');
        }
        return this.mapDTOToEntity(response.data);
      })
    );
  }

  deleteTask(taskId: string, userId: string): Observable<void> {
    return this.apiAdapter.delete(`/tasks/${taskId}?userId=${userId}`).pipe(
      map(response => {
        if (!response.success) {
          throw new Error(response.error || 'Failed to delete task');
        }
        return undefined;
      })
    );
  }

  getTaskById(taskId: string): Observable<Task | null> {
    return this.apiAdapter.get<TaskDTO>(`/tasks/${taskId}`).pipe(
      map(response => {
        if (!response.success || !response.data) {
          return null;
        }
        return this.mapDTOToEntity(response.data);
      })
    );
  }

  private mapDTOToEntity(dto: TaskDTO): Task {
    return new Task(
      dto.id,
      dto.userId,
      dto.title,
      dto.description,
      dto.completed ? TaskStatus.completed() : TaskStatus.pending(),
      new Date(dto.createdAt),
      dto.updatedAt ? new Date(dto.updatedAt) : undefined
    );
  }
}
