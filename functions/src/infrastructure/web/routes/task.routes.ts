import {Router} from "express";
import {TaskController} from "../controllers/task.controller";

export function createTaskRoutes(taskController: TaskController): Router {
  const router = Router();

  // GET /tasks/user/:userId - Get all tasks for user
  router.get("/user/:userId", taskController.getTasksByUserId);

  // GET /tasks/:taskId - Get task by ID
  router.get("/:taskId", taskController.getTaskById);

  // POST /tasks - Create new task
  router.post("/", taskController.createTask);

  // PUT /tasks/:taskId?userId=xxx - Update task
  router.put("/:taskId", taskController.updateTask);

  // DELETE /tasks/:taskId?userId=xxx - Delete task
  router.delete("/:taskId", taskController.deleteTask);

  return router;
}
