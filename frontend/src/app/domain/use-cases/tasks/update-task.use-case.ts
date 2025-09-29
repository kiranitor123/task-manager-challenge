import { Injectable } from '@angular/core';
import { Observable, switchMap, throwError } from 'rxjs';
import { TaskRepository } from '../../repositories/task.repository';
import { Task } from '../../entities/task.entity';
import { TaskNotFoundException } from '../../exceptions/task-not-found.exception';

export interface UpdateTaskCommand {
  taskId: string;
  userId: string;
  title?: string;
  description?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UpdateTaskUseCase {
  constructor(private taskRepository: TaskRepository) {}

  execute(command: UpdateTaskCommand): Observable<Task> {
    return this.taskRepository.getTaskById(command.taskId).pipe(
      switchMap(task => {
        if (!task) {
          return throwError(() => new TaskNotFoundException(command.taskId));
        }

        if (command.title !== undefined) {
          task.updateTitle(command.title);
        }

        if (command.description !== undefined) {
          task.updateDescription(command.description);
        }
        
        return this.taskRepository.updateTask(task);
      })
    );
  }
}
