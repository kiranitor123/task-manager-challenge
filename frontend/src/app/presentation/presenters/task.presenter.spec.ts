import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { TaskPresenter } from './task.presenter';
import { GetTasksUseCase } from '../../domain/use-cases/tasks/get-tasks.use-case';
import { CreateTaskUseCase, CreateTaskCommand } from '../../domain/use-cases/tasks/create-task.use-case';
import { UpdateTaskUseCase, UpdateTaskCommand } from '../../domain/use-cases/tasks/update-task.use-case';
import { ToggleTaskUseCase } from '../../domain/use-cases/tasks/toggle-task.use-case';
import { DeleteTaskUseCase } from '../../domain/use-cases/tasks/delete-task.use-case';
import { Task } from '../../domain/entities/task.entity';
import { NotificationService } from '../../infrastructure/services/notification.service';

describe('TaskPresenter', () => {
  let presenter: TaskPresenter;
  let mockGetTasksUseCase: jasmine.SpyObj<GetTasksUseCase>;
  let mockCreateTaskUseCase: jasmine.SpyObj<CreateTaskUseCase>;
  let mockUpdateTaskUseCase: jasmine.SpyObj<UpdateTaskUseCase>;
  let mockToggleTaskUseCase: jasmine.SpyObj<ToggleTaskUseCase>;
  let mockDeleteTaskUseCase: jasmine.SpyObj<DeleteTaskUseCase>;
  let mockNotificationService: jasmine.SpyObj<NotificationService>;

  beforeEach(() => {
    const getTasksSpy = jasmine.createSpyObj('GetTasksUseCase', ['execute']);
    const createTaskSpy = jasmine.createSpyObj('CreateTaskUseCase', ['execute']);
    const updateTaskSpy = jasmine.createSpyObj('UpdateTaskUseCase', ['execute']);
    const toggleTaskSpy = jasmine.createSpyObj('ToggleTaskUseCase', ['execute']);
    const deleteTaskSpy = jasmine.createSpyObj('DeleteTaskUseCase', ['execute']);
    const notificationSpy = jasmine.createSpyObj('NotificationService', ['success', 'error']);

    TestBed.configureTestingModule({
      providers: [
        TaskPresenter,
        { provide: GetTasksUseCase, useValue: getTasksSpy },
        { provide: CreateTaskUseCase, useValue: createTaskSpy },
        { provide: UpdateTaskUseCase, useValue: updateTaskSpy },
        { provide: ToggleTaskUseCase, useValue: toggleTaskSpy },
        { provide: DeleteTaskUseCase, useValue: deleteTaskSpy },
        { provide: NotificationService, useValue: notificationSpy }
      ]
    });

    presenter = TestBed.inject(TaskPresenter);
    mockGetTasksUseCase = TestBed.inject(GetTasksUseCase) as jasmine.SpyObj<GetTasksUseCase>;
    mockCreateTaskUseCase = TestBed.inject(CreateTaskUseCase) as jasmine.SpyObj<CreateTaskUseCase>;
    mockUpdateTaskUseCase = TestBed.inject(UpdateTaskUseCase) as jasmine.SpyObj<UpdateTaskUseCase>;
    mockToggleTaskUseCase = TestBed.inject(ToggleTaskUseCase) as jasmine.SpyObj<ToggleTaskUseCase>;
    mockDeleteTaskUseCase = TestBed.inject(DeleteTaskUseCase) as jasmine.SpyObj<DeleteTaskUseCase>;
    mockNotificationService = TestBed.inject(NotificationService) as jasmine.SpyObj<NotificationService>;
  });

  describe('loadTasks', () => {
    it('should load tasks successfully', () => {
      // Arrange
      const userId = 'user-123';
      const mockTasks = [
        Task.create(userId, 'Task 1', 'Description 1'),
        Task.create(userId, 'Task 2', 'Description 2')
      ];
      mockGetTasksUseCase.execute.and.returnValue(of(mockTasks));

      // Act
      presenter.loadTasks(userId).subscribe();

      // Assert
      expect(presenter.tasks()).toEqual(mockTasks);
      expect(presenter.isLoading()).toBe(false);
      expect(presenter.error()).toBeNull();
      expect(mockGetTasksUseCase.execute).toHaveBeenCalledWith(userId);
    });

    it('should handle loading errors', () => {
      // Arrange
      const userId = 'user-123';
      const error = new Error('Failed to load tasks');
      mockGetTasksUseCase.execute.and.returnValue(throwError(() => error));

      // Act
      presenter.loadTasks(userId).subscribe({
        error: () => {} // Handle error to prevent test failure
      });

      // Assert
      expect(presenter.isLoading()).toBe(false);
      expect(presenter.error()).toBe('Failed to load tasks');
      expect(mockNotificationService.error).toHaveBeenCalledWith('Error loading tasks');
    });
  });

  describe('createTask', () => {
    it('should create task successfully', () => {
      // Arrange
      const command: CreateTaskCommand = {
        userId: 'user-123',
        title: 'New Task',
        description: 'New Description'
      };
      const newTask = Task.create(command.userId, command.title, command.description);
      mockCreateTaskUseCase.execute.and.returnValue(of(newTask));

      // Act
      presenter.createTask(command).subscribe();

      // Assert
      expect(presenter.tasks()).toContain(newTask);
      expect(presenter.isLoading()).toBe(false);
      expect(mockNotificationService.success).toHaveBeenCalledWith('Task created successfully');
    });
  });

  describe('computed properties', () => {
    beforeEach(() => {
      const userId = 'user-123';
      const mockTasks = [
        Task.create(userId, 'Completed Task', 'Description 1'),
        Task.create(userId, 'Pending Task', 'Description 2')
      ];
      mockTasks[0].markAsCompleted();
      mockGetTasksUseCase.execute.and.returnValue(of(mockTasks));
      presenter.loadTasks(userId).subscribe();
    });

    it('should compute task stats correctly', () => {
      // Act
      const stats = presenter.taskStats();

      // Assert
      expect(stats.total).toBe(2);
      expect(stats.completed).toBe(1);
      expect(stats.pending).toBe(1);
    });

    it('should filter tasks by status', () => {
      // Act
      presenter.setFilter('completed');
      const completedTasks = presenter.filteredTasks();

      presenter.setFilter('pending');
      const pendingTasks = presenter.filteredTasks();

      // Assert
      expect(completedTasks.length).toBe(1);
      expect(completedTasks[0].isCompleted).toBe(true);
      
      expect(pendingTasks.length).toBe(1);
      expect(pendingTasks[0].isCompleted).toBe(false);
    });

    it('should sort tasks by creation date', () => {
      // Arrange
      const tasks = presenter.sortedTasks();

      // Assert - newest first
      expect(tasks.length).toBe(2);
      expect(tasks[0].createdAt.getTime()).toBeGreaterThanOrEqual(tasks[1].createdAt.getTime());
    });
  });

  describe('setFilter', () => {
    it('should change current filter', () => {
      // Act
      presenter.setFilter('completed');

      // Assert
      expect(presenter.currentFilter()).toBe('completed');

      // Act
      presenter.setFilter('pending');

      // Assert
      expect(presenter.currentFilter()).toBe('pending');
    });
  });

  describe('clearError', () => {
    it('should clear error message', () => {
      // Arrange
      const userId = 'user-123';
      const error = new Error('Test error');
      mockGetTasksUseCase.execute.and.returnValue(throwError(() => error));
      presenter.loadTasks(userId).subscribe({ error: () => {} });

      // Act
      presenter.clearError();

      // Assert
      expect(presenter.error()).toBeNull();
    });
  });
});