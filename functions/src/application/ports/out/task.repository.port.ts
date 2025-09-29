import {Task} from "../../../domain/entities/task.entity";
import {TaskId} from "../../../domain/value-objects/task-id.vo";
import {UserId} from "../../../domain/value-objects/user-id.vo";

export interface TaskRepositoryPort {
    findById(id: TaskId): Promise<Task | null>;
    findByUserId(userId: UserId): Promise<Task[]>;
    save(task: Task): Promise<Task>;
    update(task: Task): Promise<Task>;
    delete(id: TaskId): Promise<void>;
}
