import { Injectable } from '@angular/core';
import { Observable, switchMap, throwError } from 'rxjs';
import { TaskRepository } from '../../repositories/task.repository';
import { Task } from '../../entities/task.entity';
import { TaskNotFoundException } from '../../exceptions/task-not-found.exception';

@Injectable({
  providedIn: 'root'
})
export class ToggleTaskUseCase {
  constructor(private taskRepository: TaskRepository) {}

  execute(taskId: string): Observable<Task> {
    return this.taskRepository.getTaskById(taskId).pipe(
      switchMap(task => {
        if (!task) {
          return throwError(() => new TaskNotFoundException(taskId));
        }

        task.toggleStatus();
        return this.taskRepository.updateTask(task);
      })
    );
  }
}