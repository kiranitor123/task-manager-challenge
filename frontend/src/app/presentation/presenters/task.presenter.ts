import { Injectable, signal, computed } from '@angular/core';
import { Observable, of } from 'rxjs';
import { GetTasksUseCase } from '../../domain/use-cases/tasks/get-tasks.use-case';
import { CreateTaskUseCase, CreateTaskCommand } from '../../domain/use-cases/tasks/create-task.use-case';
import { UpdateTaskUseCase, UpdateTaskCommand } from '../../domain/use-cases/tasks/update-task.use-case';
import { ToggleTaskUseCase } from '../../domain/use-cases/tasks/toggle-task.use-case';
import { DeleteTaskUseCase } from '../../domain/use-cases/tasks/delete-task.use-case';
import { Task } from '../../domain/entities/task.entity';
import { NotificationService } from '../../infrastructure/services/notification.service';

export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
}

@Injectable({
  providedIn: 'root'
})
export class TaskPresenter {
  private readonly tasksSignal = signal<Task[]>([]);
  private readonly loadingSignal = signal(false);
  private readonly errorSignal = signal<string | null>(null);
  private readonly filterSignal = signal<'all' | 'pending' | 'completed'>('all');

  // Computed properties
  readonly tasks = computed(() => this.tasksSignal());
  readonly isLoading = computed(() => this.loadingSignal());
  readonly error = computed(() => this.errorSignal());
  readonly currentFilter = computed(() => this.filterSignal());

  readonly filteredTasks = computed(() => {
    const tasks = this.tasksSignal();
    const filter = this.filterSignal();
    
    switch (filter) {
      case 'completed':
        return tasks.filter(task => task.isCompleted);
      case 'pending':
        return tasks.filter(task => !task.isCompleted);
      default:
        return tasks;
    }
  });

  readonly sortedTasks = computed(() => {
    return this.filteredTasks().sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  });

  readonly taskStats = computed((): TaskStats => {
    const tasks = this.tasksSignal();
    return {
      total: tasks.length,
      completed: tasks.filter(task => task.isCompleted).length,
      pending: tasks.filter(task => !task.isCompleted).length
    };
  });
  
  constructor(
    private getTasksUseCase: GetTasksUseCase,
    private createTaskUseCase: CreateTaskUseCase,
    private updateTaskUseCase: UpdateTaskUseCase,
    private toggleTaskUseCase: ToggleTaskUseCase,
    private deleteTaskUseCase: DeleteTaskUseCase,
    private notificationService: NotificationService
  ) {}

  loadTasks(userId: string): Observable<void> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    return new Observable(observer => {
      this.getTasksUseCase.execute(userId).subscribe({
        next: (tasks) => {
          this.tasksSignal.set(tasks);
          this.loadingSignal.set(false);
          observer.next();
          observer.complete();
        },
        error: (error) => {
          this.loadingSignal.set(false);
          this.errorSignal.set(error.message || 'Error loading tasks');
          this.notificationService.error('Error loading tasks');
          observer.error(error);
        }
      });
    });
  }

  createTask(command: CreateTaskCommand): Observable<void> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    return new Observable(observer => {
      this.createTaskUseCase.execute(command).subscribe({
        next: (newTask) => {
          const currentTasks = this.tasksSignal();
          this.tasksSignal.set([newTask, ...currentTasks]);
          this.loadingSignal.set(false);
          this.notificationService.success('Task created successfully');
          observer.next();
          observer.complete();
        },
        error: (error) => {
          this.loadingSignal.set(false);
          this.errorSignal.set(error.message || 'Error creating task');
          this.notificationService.error('Error creating task');
          observer.error(error);
        }
      });
    });
  }

  updateTask(command: UpdateTaskCommand): Observable<void> {
    return new Observable(observer => {
      this.updateTaskUseCase.execute(command).subscribe({
        next: (updatedTask) => {
          const currentTasks = this.tasksSignal();
          const index = currentTasks.findIndex(task => task.id === command.taskId);
          if (index >= 0) {
            const newTasks = [...currentTasks];
            newTasks[index] = updatedTask;
            this.tasksSignal.set(newTasks);
          }
          this.notificationService.success('Task updated successfully');
          observer.next();
          observer.complete();
        },
        error: (error) => {
          this.errorSignal.set(error.message || 'Error updating task');
          this.notificationService.error('Error updating task');
          observer.error(error);
        }
      });
    });
  }

  toggleTask(taskId: string): Observable<void> {
    return new Observable(observer => {
      this.toggleTaskUseCase.execute(taskId).subscribe({
        next: (updatedTask) => {
          const currentTasks = this.tasksSignal();
          const index = currentTasks.findIndex(task => task.id === taskId);
          if (index >= 0) {
            const newTasks = [...currentTasks];
            newTasks[index] = updatedTask;
            this.tasksSignal.set(newTasks);
          }
          observer.next();
          observer.complete();
        },
        error: (error) => {
          this.errorSignal.set(error.message || 'Error updating task');
          this.notificationService.error('Error updating task');
          observer.error(error);
        }
      });
    });
  }

  deleteTask(taskId: string, userId: string): Observable<void> {
    return new Observable(observer => {
      this.deleteTaskUseCase.execute(taskId, userId).subscribe({
        next: () => {
          const currentTasks = this.tasksSignal();
          this.tasksSignal.set(currentTasks.filter(task => task.id !== taskId));
          this.notificationService.success('Task deleted successfully');
          observer.next();
          observer.complete();
        },
        error: (error) => {
          this.errorSignal.set(error.message || 'Error deleting task');
          this.notificationService.error('Error deleting task');
          observer.error(error);
        }
      });
    });
  }

  setFilter(filter: 'all' | 'pending' | 'completed'): void {
    this.filterSignal.set(filter);
  }

  clearError(): void {
    this.errorSignal.set(null);
  }
}