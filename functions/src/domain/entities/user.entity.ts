import {Email} from "../value-objects/email.vo";
import {UserId} from "../value-objects/user-id.vo";

export class User {
  constructor(
        private readonly _id: UserId,
        private readonly _email: Email,
        private readonly _createdAt: Date
  ) { }

  get id(): UserId {
    return this._id;
  }

  get email(): Email {
    return this._email;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  static create(email: string): User {
    return new User(
      UserId.generate(),
      Email.create(email),
      new Date()
    );
  }

  toJSON() {
    return {
      id: this._id.value,
      email: this._email.value,
      createdAt: this._createdAt.toISOString(),
    };
  }
}
