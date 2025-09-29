import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TaskRepository } from '../../repositories/task.repository';
import { Task } from '../../entities/task.entity';

@Injectable({
  providedIn: 'root'
})
export class GetTasksUseCase {
  constructor(private taskRepository: TaskRepository) {}

  execute(userId: string): Observable<Task[]> {
    if (!userId.trim()) {
      throw new Error('User ID is required');
    }
    return this.taskRepository.getTasksByUserId(userId);
  }
}
