import { Injectable } from '@angular/core';
import { Observable, switchMap, throwError } from 'rxjs';
import { TaskRepository } from '../../repositories/task.repository';
import { TaskNotFoundException } from '../../exceptions/task-not-found.exception';

@Injectable({
  providedIn: 'root'
})
export class DeleteTaskUseCase {
  constructor(private taskRepository: TaskRepository) {}

  execute(taskId: string, userId: string): Observable<void> {
    return this.taskRepository.getTaskById(taskId).pipe(
      switchMap(task => {
        if (!task) {
          return throwError(() => new TaskNotFoundException(taskId));
        }
        return this.taskRepository.deleteTask(taskId, userId);
      })
    );
  }
}