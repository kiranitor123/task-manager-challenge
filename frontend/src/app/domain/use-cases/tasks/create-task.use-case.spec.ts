import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { CreateTaskUseCase, CreateTaskCommand } from './create-task.use-case';
import { TaskRepository } from '../../repositories/task.repository';
import { Task } from '../../entities/task.entity';

describe('CreateTaskUseCase', () => {
    let useCase: CreateTaskUseCase;
    let mockTaskRepository: jasmine.SpyObj<TaskRepository>;

    beforeEach(() => {
        const spy = jasmine.createSpyObj('TaskRepository', ['createTask']);

        TestBed.configureTestingModule({
            providers: [
                CreateTaskUseCase,
                { provide: TaskRepository, useValue: spy }
            ]
        });

        useCase = TestBed.inject(CreateTaskUseCase);
        mockTaskRepository = TestBed.inject(TaskRepository) as jasmine.SpyObj<TaskRepository>;
    });

    describe('execute', () => {
        it('should create task successfully', () => {
            // Arrange
            const command: CreateTaskCommand = {
                userId: 'user-123',
                title: 'Test Task',
                description: 'Test Description'
            };

            const mockTask = Task.create(command.userId, command.title, command.description);
            mockTaskRepository.createTask.and.returnValue(of(mockTask));

            // Act
            useCase.execute(command).subscribe({
                next: (result) => {
                    // Assert
                    expect(result).toBe(mockTask);
                    expect(result.title).toBe(command.title);
                    expect(result.description).toBe(command.description);
                    expect(result.userId).toBe(command.userId);
                    expect(mockTaskRepository.createTask).toHaveBeenCalledWith(jasmine.any(Task));
                }
            });
        });

        it('should throw error for invalid title', () => {
            // Arrange
            const command: CreateTaskCommand = {
                userId: 'user-123',
                title: 'ab', // Too short
                description: 'Test Description'
            };

            // Act & Assert
            useCase.execute(command).subscribe({
                error: (error) => {
                    expect(error.message).toContain('Task title must have at least 3 characters');
                }
            });
        });

        it('should handle repository errors', () => {
            // Arrange
            const command: CreateTaskCommand = {
                userId: 'user-123',
                title: 'Test Task',
                description: 'Test Description'
            };

            const repositoryError = new Error('Database connection failed');
            mockTaskRepository.createTask.and.returnValue(throwError(() => repositoryError));

            // Act
            useCase.execute(command).subscribe({
                error: (error) => {
                    // Assert
                    expect(error).toBe(repositoryError);
                }
            });
        });
    });
});