import { Email } from './email.vo';

describe('Email Value Object', () => {
    describe('create', () => {
        it('should create valid email', () => {
            // Arrange
            const validEmail = 'test@example.com';

            // Act
            const email = new Email(validEmail);

            // Assert
            expect(email.value).toBe(validEmail.toLowerCase());
        });

        it('should normalize email to lowercase', () => {
            // Arrange
            const upperCaseEmail = 'TEST@EXAMPLE.COM';

            // Act
            const email = new Email(upperCaseEmail);

            // Assert
            expect(email.value).toBe('test@example.com');
        });

        it('should throw error for invalid email format', () => {
            // Arrange
            const invalidEmails = ['invalid-email', '@example.com', 'test@', 'test'];

            // Act & Assert
            invalidEmails.forEach(invalidEmail => {
                expect(() => new Email(invalidEmail)).toThrowError('Invalid email format');
            });
            
            expect(() => new Email('')).toThrowError('Email cannot be empty');
            expect(() => new Email('   ')).toThrowError('Email cannot be empty');
        });

        it('should throw error for empty email', () => {
            // Act & Assert
            expect(() => new Email('')).toThrowError('Email cannot be empty');
            expect(() => new Email('   ')).toThrowError('Email cannot be empty');
        });
    });

    describe('equals', () => {
        it('should return true for equal emails', () => {
            // Arrange
            const email1 = new Email('test@example.com');
            const email2 = new Email('TEST@EXAMPLE.COM');

            // Act & Assert
            expect(email1.equals(email2)).toBe(true);
        });

        it('should return false for different emails', () => {
            // Arrange
            const email1 = new Email('test1@example.com');
            const email2 = new Email('test2@example.com');

            // Act & Assert
            expect(email1.equals(email2)).toBe(false);
        });
    });
});