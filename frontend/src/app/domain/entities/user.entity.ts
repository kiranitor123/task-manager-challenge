import { Email } from '../value-objects/email.vo';

export class User {
  constructor(
    private readonly _id: string,
    private readonly _email: Email,
    private readonly _createdAt: Date
  ) {}

  get id(): string {
    return this._id;
  }

  get email(): string {
    return this._email.value;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  static create(email: string): User {
    return new User(
      crypto.randomUUID(),
      new Email(email),
      new Date()
    );
  }

  toJSON() {
    return {
      id: this._id,
      email: this._email.value,
      createdAt: this._createdAt
    };
  }
}