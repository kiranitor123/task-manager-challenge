export class TaskStatus {
  private constructor(private readonly _isCompleted: boolean) { }

  get isCompleted(): boolean {
    return this._isCompleted;
  }

  get isPending(): boolean {
    return !this._isCompleted;
  }

  static completed(): TaskStatus {
    return new TaskStatus(true);
  }

  static pending(): TaskStatus {
    return new TaskStatus(false);
  }

  toggle(): TaskStatus {
    return new TaskStatus(!this._isCompleted);
  }

  equals(other: TaskStatus): boolean {
    return this._isCompleted === other._isCompleted;
  }
}
