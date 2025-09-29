export class TaskStatus {
  constructor(private readonly _isCompleted: boolean) {}

  get isCompleted(): boolean {
    return this._isCompleted;
  }

  get isPending(): boolean {
    return !this._isCompleted;
  }

  toggle(): TaskStatus {
    return new TaskStatus(!this._isCompleted);
  }

  static completed(): TaskStatus {
    return new TaskStatus(true);
  }

  static pending(): TaskStatus {
    return new TaskStatus(false);
  }

  equals(other: TaskStatus): boolean {
    return this._isCompleted === other._isCompleted;
  }
}