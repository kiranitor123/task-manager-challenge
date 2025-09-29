import {Task} from "../../../domain/entities/task.entity";
import {TaskId} from "../../../domain/value-objects/task-id.vo";
import {UserId} from "../../../domain/value-objects/user-id.vo";
import {TaskStatus} from "../../../domain/value-objects/task-status.vo";
import {TaskRepositoryPort} from "../../../application/ports/out/task.repository.port";
import {LoggerPort} from "../../../application/ports/out/logger.port";
import {FirestoreAdapter} from "./firestore.adapter";

interface TaskDocument {
    id: string;
    userId: string;
    title: string;
    description: string;
    completed: boolean;
    createdAt: FirebaseFirestore.Timestamp;
    updatedAt?: FirebaseFirestore.Timestamp;
}

export class TaskRepository implements TaskRepositoryPort {
  private readonly collection = "tasks";

  constructor(
        private readonly firestore: FirestoreAdapter,
        private readonly logger: LoggerPort
  ) { }

  async findById(id: TaskId): Promise<Task | null> {
    try {
      const doc = await this.firestore
        .getCollection(this.collection)
        .doc(id.value)
        .get();

      if (!doc.exists) {
        return null;
      }

      return this.mapDocumentToEntity(doc.id, doc.data() as TaskDocument);
    } catch (error) {
      this.logger.error("Failed to find task by ID", error as Error, {
        taskId: id.value,
      });
      throw new Error(`Repository error: ${error}`);
    }
  }

  async findByUserId(userId: UserId): Promise<Task[]> {
    try {
      const snapshot = await this.firestore
        .getCollection(this.collection)
        .where("userId", "==", userId.value)
        .orderBy("createdAt", "desc")
        .get();

      const tasks = snapshot.docs.map((doc) =>
        this.mapDocumentToEntity(doc.id, doc.data() as TaskDocument)
      );

      this.logger.info("Tasks retrieved from repository", {
        userId: userId.value,
        count: tasks.length,
      });

      return tasks;
    } catch (error) {
      this.logger.error("Failed to find tasks by user ID", error as Error, {
        userId: userId.value,
      });
      throw new Error(`Repository error: ${error}`);
    }
  }

  async save(task: Task): Promise<Task> {
    try {
      const taskData = {
        userId: task.userId.value,
        title: task.title,
        description: task.description,
        completed: task.status.isCompleted,
        createdAt: this.firestore.convertToTimestamp(task.createdAt),
        updatedAt: task.updatedAt ? this.firestore.convertToTimestamp(task.updatedAt) : null,
      };

      const docRef = await this.firestore
        .getCollection(this.collection)
        .add(taskData);

      this.logger.info("Task saved to repository", {
        taskId: docRef.id,
        userId: task.userId.value,
      });

      // Return task with the generated ID
      return new Task(
        TaskId.fromString(docRef.id),
        task.userId,
        task.title,
        task.description,
        task.status,
        task.createdAt,
        task.updatedAt
      );
    } catch (error) {
      this.logger.error("Failed to save task", error as Error, {
        userId: task.userId.value,
        title: task.title,
      });
      throw new Error(`Repository error: ${error}`);
    }
  }

  async update(task: Task): Promise<Task> {
    try {
      const taskData = {
        title: task.title,
        description: task.description,
        completed: task.status.isCompleted,
        updatedAt: this.firestore.convertToTimestamp(task.updatedAt || new Date()),
      };

      await this.firestore
        .getCollection(this.collection)
        .doc(task.id.value)
        .update(taskData);

      this.logger.info("Task updated in repository", {
        taskId: task.id.value,
        userId: task.userId.value,
      });

      return task;
    } catch (error) {
      this.logger.error("Failed to update task", error as Error, {
        taskId: task.id.value,
        userId: task.userId.value,
      });
      throw new Error(`Repository error: ${error}`);
    }
  }

  async delete(id: TaskId): Promise<void> {
    try {
      await this.firestore
        .getCollection(this.collection)
        .doc(id.value)
        .delete();

      this.logger.info("Task deleted from repository", {taskId: id.value});
    } catch (error) {
      this.logger.error("Failed to delete task", error as Error, {
        taskId: id.value,
      });
      throw new Error(`Repository error: ${error}`);
    }
  }

  private mapDocumentToEntity(id: string, doc: TaskDocument): Task {
    return new Task(
      TaskId.fromString(id),
      UserId.fromString(doc.userId),
      doc.title,
      doc.description,
      doc.completed ? TaskStatus.completed() : TaskStatus.pending(),
      this.firestore.convertTimestamp(doc.createdAt),
      doc.updatedAt ? this.firestore.convertTimestamp(doc.updatedAt) : undefined
    );
  }
}
