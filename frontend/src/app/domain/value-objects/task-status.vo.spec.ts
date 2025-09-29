import { TaskStatus } from './task-status.vo';

describe('TaskStatus Value Object', () => {
  describe('factory methods', () => {
    it('should create completed status', () => {
      // Act
      const status = TaskStatus.completed();

      // Assert
      expect(status.isCompleted).toBe(true);
      expect(status.isPending).toBe(false);
    });

    it('should create pending status', () => {
      // Act
      const status = TaskStatus.pending();

      // Assert
      expect(status.isCompleted).toBe(false);
      expect(status.isPending).toBe(true);
    });
  });

  describe('toggle', () => {
    it('should toggle from pending to completed', () => {
      // Arrange
      const pendingStatus = TaskStatus.pending();

      // Act
      const completedStatus = pendingStatus.toggle();

      // Assert
      expect(completedStatus.isCompleted).toBe(true);
      expect(completedStatus.isPending).toBe(false);
    });

    it('should toggle from completed to pending', () => {
      // Arrange
      const completedStatus = TaskStatus.completed();

      // Act
      const pendingStatus = completedStatus.toggle();

      // Assert
      expect(pendingStatus.isCompleted).toBe(false);
      expect(pendingStatus.isPending).toBe(true);
    });
  });

  describe('equals', () => {
    it('should return true for equal statuses', () => {
      // Arrange
      const status1 = TaskStatus.completed();
      const status2 = TaskStatus.completed();

      // Act & Assert
      expect(status1.equals(status2)).toBe(true);
    });

    it('should return false for different statuses', () => {
      // Arrange
      const completedStatus = TaskStatus.completed();
      const pendingStatus = TaskStatus.pending();

      // Act & Assert
      expect(completedStatus.equals(pendingStatus)).toBe(false);
    });
  });
});