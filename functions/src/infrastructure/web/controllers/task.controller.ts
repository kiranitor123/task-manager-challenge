import {Request, Response, NextFunction} from "express";
import {TaskService} from "../../../application/services/task.service";
import {validateCreateTaskDto} from "../dtos/create-task.dto";
import {validateUpdateTaskDto} from "../dtos/update-task.dto";

export class TaskController {
  constructor(private readonly taskService: TaskService) { }

  getTaskById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const {taskId} = req.params;

      if (!taskId) {
        res.status(400).json({
          success: false,
          error: "Task ID parameter is required",
        });
        return;
      }

      const task = await this.taskService.getTaskById(taskId);

      if (!task) {
        res.status(404).json({
          success: false,
          error: "Task not found",
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: task.toJSON(),
      });
    } catch (error) {
      next(error);
    }
  };

  getTasksByUserId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const {userId} = req.params;

      if (!userId) {
        res.status(400).json({
          success: false,
          error: "User ID parameter is required",
        });
        return;
      }

      const tasks = await this.taskService.getTasks({userId});

      res.status(200).json({
        success: true,
        data: tasks.map((task) => task.toJSON()),
      });
    } catch (error) {
      next(error);
    }
  };

  createTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const createTaskDto = validateCreateTaskDto(req.body);
      const task = await this.taskService.createTask(createTaskDto);

      res.status(201).json({
        success: true,
        data: task.toJSON(),
        message: "Task created successfully",
      });
    } catch (error) {
      next(error);
    }
  };

  updateTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const {taskId} = req.params;
      const {userId} = req.query;

      if (!taskId) {
        res.status(400).json({
          success: false,
          error: "Task ID parameter is required",
        });
        return;
      }

      if (!userId || typeof userId !== "string") {
        res.status(400).json({
          success: false,
          error: "User ID query parameter is required",
        });
        return;
      }

      const updateTaskDto = validateUpdateTaskDto(req.body);
      const task = await this.taskService.updateTask({
        taskId,
        userId,
        ...updateTaskDto,
      });

      res.status(200).json({
        success: true,
        data: task.toJSON(),
        message: "Task updated successfully",
      });
    } catch (error) {
      if ((error as Error).name === "TaskNotFoundException") {
        res.status(404).json({
          success: false,
          error: "Task not found",
        });
        return;
      }
      next(error);
    }
  };

  deleteTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const {taskId} = req.params;
      const {userId} = req.query;

      if (!taskId) {
        res.status(400).json({
          success: false,
          error: "Task ID parameter is required",
        });
        return;
      }

      if (!userId || typeof userId !== "string") {
        res.status(400).json({
          success: false,
          error: "User ID query parameter is required",
        });
        return;
      }

      await this.taskService.deleteTask({taskId, userId});

      res.status(200).json({
        success: true,
        message: "Task deleted successfully",
      });
    } catch (error) {
      if ((error as Error).name === "TaskNotFoundException") {
        res.status(404).json({
          success: false,
          error: "Task not found",
        });
        return;
      }
      next(error);
    }
  };
}
