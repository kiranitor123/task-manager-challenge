import {ConsoleLogger} from "../adapters/logging/console.logger";
import {FirestoreAdapter} from "../adapters/persistence/firestore.adapter";
import {UserRepository} from "../adapters/persistence/user.repository";
import {TaskRepository} from "../adapters/persistence/task.repository";

// Use Cases
import {CreateUserUseCase} from "../../application/use-cases/auth/create-user.use-case";
import {FindUserUseCase} from "../../application/use-cases/auth/find-user.use-case";
import {CreateTaskUseCase} from "../../application/use-cases/tasks/create-task.use-case";
import {GetTaskUseCase} from "../../application/use-cases/tasks/get-task.use-case";
import {GetTasksUseCase} from "../../application/use-cases/tasks/get-tasks.use-case";
import {UpdateTaskUseCase} from "../../application/use-cases/tasks/update-task.use-case";
import {DeleteTaskUseCase} from "../../application/use-cases/tasks/delete-task.use-case";

// Application Services
import {AuthService} from "../../application/services/auth.service";
import {TaskService} from "../../application/services/task.service";

// Controllers
import {AuthController} from "../web/controllers/auth.controller";
import {TaskController} from "../web/controllers/task.controller";

export class DependencyContainer {
  // Adapters
  private logger = new ConsoleLogger();
  private firestoreAdapter = new FirestoreAdapter(this.logger);
  private userRepository = new UserRepository(this.firestoreAdapter, this.logger);
  private taskRepository = new TaskRepository(this.firestoreAdapter, this.logger);

  // Use Cases
  private createUserUseCase = new CreateUserUseCase(this.userRepository, this.logger);
  private findUserUseCase = new FindUserUseCase(this.userRepository, this.logger);
  private createTaskUseCase = new CreateTaskUseCase(this.taskRepository, this.userRepository, this.logger);
  private getTasksUseCase = new GetTasksUseCase(this.taskRepository, this.logger);
  private getTaskUseCase = new GetTaskUseCase(this.taskRepository, this.logger);
  private updateTaskUseCase = new UpdateTaskUseCase(this.taskRepository, this.logger);
  private deleteTaskUseCase = new DeleteTaskUseCase(this.taskRepository, this.logger);

  // Application Services
  private authService = new AuthService(this.createUserUseCase, this.findUserUseCase);
  private taskService = new TaskService(
    this.createTaskUseCase,
    this.getTasksUseCase,
    this.getTaskUseCase,
    this.updateTaskUseCase,
    this.deleteTaskUseCase
  );

  // Controllers
  public readonly authController = new AuthController(this.authService);
  public readonly taskController = new TaskController(this.taskService);
}
