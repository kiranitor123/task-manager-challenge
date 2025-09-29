import {randomUUID} from "crypto";

export class TaskId {
  private constructor(private readonly _value: string) {}

  get value(): string {
    return this._value;
  }

  static generate(): TaskId {
    return new TaskId(randomUUID());
  }

  static fromString(id: string): TaskId {
    if (!id || !id.trim()) {
      throw new Error("Task ID cannot be empty");
    }
    return new TaskId(id.trim());
  }

  equals(other: TaskId): boolean {
    return this._value === other._value;
  }
}
