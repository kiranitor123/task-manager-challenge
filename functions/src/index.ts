import {onRequest} from "firebase-functions/v2/https";
import express from "express";
import cors from "cors";

import {DependencyContainer} from "./infrastructure/config/dependency-injection";
import {createAuthRoutes} from "./infrastructure/web/routes/auth.routes";
import {createTaskRoutes} from "./infrastructure/web/routes/task.routes";
import {createErrorHandler} from "./infrastructure/web/middleware/error-handler";
import {createRequestLogger} from "./infrastructure/web/middleware/request-logger";
import {ConsoleLogger} from "./infrastructure/adapters/logging/console.logger";


function createApp() {
  const container = new DependencyContainer();
  const logger = new ConsoleLogger();

  const app = express();

  app.use(cors({origin: true, credentials: true}));
  app.use(express.json({limit: "10mb"}));
  app.use(express.urlencoded({extended: true}));
  app.use(createRequestLogger(logger));

  app.use("/users", createAuthRoutes(container.authController));
  app.use("/tasks", createTaskRoutes(container.taskController));

  app.get("/", (req, res) => {
    res.status(200).json({ok: true, message: "API ready"});
  });

  app.use(createErrorHandler(logger));
  app.use("*", (req, res) => {
    res.status(404).json({ok: false, error: "Endpoint not found"});
  });

  return app;
}

// Export AFTER everything is set
export const api = onRequest(createApp());
