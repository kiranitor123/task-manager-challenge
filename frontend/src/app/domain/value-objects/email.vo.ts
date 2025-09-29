export class Email {
  private readonly _value: string;

  constructor(email: string) {
    if (!email || email.trim() === '') {
      throw new Error('Email cannot be empty');
    }
    if (!this.isValid(email)) {
      throw new Error('Invalid email format');
    }
    this._value = email.toLowerCase().trim();
  }

  get value(): string {
    return this._value;
  }

  private isValid(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 254;
  }

  equals(other: Email): boolean {
    return this._value === other._value;
  }
}