import { Task } from './task.entity';

describe('Task Entity', () => {
    describe('create', () => {
        it('should create a task with valid data', () => {
            // Arrange
            const userId = 'user-123';
            const title = 'Test Task';
            const description = 'Test Description';

            // Act
            const task = Task.create(userId, title, description);

            // Assert
            expect(task).toBeInstanceOf(Task);
            expect(task.userId).toBe(userId);
            expect(task.title).toBe(title);
            expect(task.description).toBe(description);
            expect(task.isCompleted).toBe(false);
            expect(task.id).toBeDefined();
            expect(task.createdAt).toBeInstanceOf(Date);
        });

        it('should throw error for invalid title', () => {
            // Arrange
            const userId = 'user-123';
            const invalidTitle = 'ab'; // Too short
            const description = 'Test Description';

            // Act & Assert
            expect(() => Task.create(userId, invalidTitle, description))
                .toThrowError('Task title must have at least 3 characters');
        });

        it('should throw error for empty description', () => {
            // Arrange
            const userId = 'user-123';
            const title = 'Valid Title';
            const emptyDescription = '';

            // Act & Assert
            expect(() => Task.create(userId, title, emptyDescription))
                .toThrowError('Task description cannot be empty');
        });
    });

    describe('updateTitle', () => {
        it('should update title successfully', () => {
            // Arrange
            const task = Task.create('user-123', 'Original Title', 'Description');
            const newTitle = 'Updated Title';

            // Act
            task.updateTitle(newTitle);

            // Assert
            expect(task.title).toBe(newTitle);
            expect(task.updatedAt).toBeInstanceOf(Date);
        });

        it('should throw error for invalid title', () => {
            // Arrange
            const task = Task.create('user-123', 'Original Title', 'Description');
            const invalidTitle = 'ab';

            // Act & Assert
            expect(() => task.updateTitle(invalidTitle)).toThrowError('Task title must have at least 3 characters');
        });
    });

    describe('toggleCompletion', () => {
        it('should mark task as completed', () => {
            // Arrange
            const task = Task.create('user-123', 'Test Task', 'Description');

            // Act
            task.markAsCompleted();

            // Assert
            expect(task.isCompleted).toBe(true);
            expect(task.updatedAt).toBeInstanceOf(Date);
        });

        it('should mark task as pending', () => {
            // Arrange
            const task = Task.create('user-123', 'Test Task', 'Description');
            task.markAsCompleted();

            // Act
            task.markAsPending();

            // Assert
            expect(task.isCompleted).toBe(false);
        });

        it('should toggle status correctly', () => {
            // Arrange
            const task = Task.create('user-123', 'Test Task', 'Description');
            const initialStatus = task.isCompleted;

            // Act
            task.toggleStatus();

            // Assert
            expect(task.isCompleted).toBe(!initialStatus);
        });
    });
});