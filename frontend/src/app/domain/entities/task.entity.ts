import { TaskStatus } from '../value-objects/task-status.vo';

export class Task {
  constructor(
    private readonly _id: string,
    private readonly _userId: string,
    private _title: string,
    private _description: string,
    private _status: TaskStatus,
    private readonly _createdAt: Date,
    private _updatedAt?: Date
  ) {}

  get id(): string {
    return this._id;
  }

  get userId(): string {
    return this._userId;
  }

  get title(): string {
    return this._title;
  }

  get description(): string {
    return this._description;
  }

  get isCompleted(): boolean {
    return this._status.isCompleted;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date | undefined {
    return this._updatedAt;
  }

  updateTitle(title: string): void {
    if (title.trim().length < 3) {
      throw new Error('Task title must have at least 3 characters');
    }
    this._title = title;
    this._updatedAt = new Date();
  }

  updateDescription(description: string): void {
    if (!description.trim()) {
      throw new Error('Task description cannot be empty');
    }
    this._description = description;
    this._updatedAt = new Date();
  }

  toggleStatus(): void {
    this._status = this._status.toggle();
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

  static create(userId: string, title: string, description: string): Task {
    if (title.trim().length < 3) {
      throw new Error('Task title must have at least 3 characters');
    }
    if (!description.trim()) {
      throw new Error('Task description cannot be empty');
    }

    return new Task(
      crypto.randomUUID(),
      userId,
      title.trim(),
      description.trim(),
      TaskStatus.pending(),
      new Date()
    );
  }

  toJSON() {
    return {
      id: this._id,
      userId: this._userId,
      title: this._title,
      description: this._description,
      completed: this._status.isCompleted,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt
    };
  }
}
