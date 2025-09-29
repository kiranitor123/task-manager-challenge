export class Email {
  private constructor(private readonly _value: string) { }

  get value(): string {
    return this._value;
  }

  static create(email: string): Email {
    if (!email || !email.trim()) {
      throw new Error("Email cannot be empty");
    }

    const trimmed = email.trim().toLowerCase();

    if (!this.isValidFormat(trimmed)) {
      throw new Error("Invalid email format");
    }

    if (trimmed.length > 254) {
      throw new Error("Email is too long");
    }

    return new Email(trimmed);
  }

  private static isValidFormat(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  equals(other: Email): boolean {
    return this._value === other._value;
  }
}
