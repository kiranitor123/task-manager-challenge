import {TaskId} from "../value-objects/task-id.vo";
import {UserId} from "../value-objects/user-id.vo";
import {TaskStatus} from "../value-objects/task-status.vo";

export class Task {
  constructor(
        private readonly _id: TaskId,
        private readonly _userId: UserId,
        private _title: string,
        private _description: string,
        private _status: TaskStatus,
        private readonly _createdAt: Date,
        private _updatedAt?: Date
  ) {
    this.validateTitle(_title);
    this.validateDescription(_description);
  }

  get id(): TaskId {
    return this._id;
  }

  get userId(): UserId {
    return this._userId;
  }

  get title(): string {
    return this._title;
  }

  get description(): string {
    return this._description;
  }

  get status(): TaskStatus {
    return this._status;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date | undefined {
    return this._updatedAt;
  }

  updateTitle(newTitle: string): void {
    this.validateTitle(newTitle);
    this._title = newTitle;
    this._updatedAt = new Date();
  }

  updateDescription(newDescription: string): void {
    this.validateDescription(newDescription);
    this._description = newDescription;
    this._updatedAt = new Date();
  }

  markAsCompleted(): void {
    this._status = TaskStatus.completed();
    this._updatedAt = new Date();
  }

  markAsPending(): void {
    this._status = TaskStatus.pending();
    this._updatedAt = new Date();
  }

  toggleStatus(): void {
    this._status = this._status.toggle();
    this._updatedAt = new Date();
  }

  private validateTitle(title: string): void {
    if (!title || title.trim().length < 3) {
      throw new Error("Task title must have at least 3 characters");
    }
    if (title.length > 100) {
      throw new Error("Task title must have maximum 100 characters");
    }
  }

  private validateDescription(description: string): void {
    if (!description || !description.trim()) {
      throw new Error("Task description cannot be empty");
    }
    if (description.length > 500) {
      throw new Error("Task description must have maximum 500 characters");
    }
  }

  static create(userId: string, title: string, description: string): Task {
    return new Task(
      TaskId.generate(),
      UserId.fromString(userId),
      title.trim(),
      description.trim(),
      TaskStatus.pending(),
      new Date()
    );
  }

  toJSON() {
    return {
      id: this._id.value,
      userId: this._userId.value,
      title: this._title,
      description: this._description,
      completed: this._status.isCompleted,
      createdAt: this._createdAt.toISOString(),
      updatedAt: this._updatedAt?.toISOString(),
    };
  }
}
