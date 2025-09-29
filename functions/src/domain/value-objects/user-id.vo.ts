import {v4 as uuidv4} from "uuid";
export class UserId {
  private constructor(private readonly _value: string) { }

  get value(): string {
    return this._value;
  }
  static generate(): UserId {
    return new UserId(uuidv4());
  }
  static fromString(id: string): UserId {
    if (!id || !id.trim()) {
      throw new Error("User ID cannot be empty");
    }
    return new UserId(id.trim());
  }

  equals(other: UserId): boolean {
    return this._value === other._value;
  }
}
