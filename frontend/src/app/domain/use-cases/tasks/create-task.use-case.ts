import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { TaskRepository } from '../../repositories/task.repository';
import { Task } from '../../entities/task.entity';

export interface CreateTaskCommand {
  userId: string;
  title: string;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class CreateTaskUseCase {
  constructor(private taskRepository: TaskRepository) { }

  execute(command: CreateTaskCommand): Observable<Task> {
    try {
      const task = Task.create(
        command.userId,
        command.title,
        command.description
      );
      return this.taskRepository.createTask(task);
    } catch (error) {
      return throwError(() => error);
    }
  }
}