import {Request, Response, NextFunction} from "express";
import {LoggerPort} from "../../../application/ports/out/logger.port";

export function createErrorHandler(logger: LoggerPort) {
  return (error: Error, req: Request, res: Response, next: NextFunction) => {
    logger.error("API Error ", error, {
      method: req.method,
      url: req.url,
      body: req.body,
      params: req.params,
      query: req.query,
    });

    // Domain exceptions
    if (error.name === "UserAlreadyExistsException") {
      return res.status(409).json({
        success: false,
        error: error.message,
      });
    }

    if (error.name === "UserNotFoundException") {
      return res.status(404).json({
        success: false,
        error: error.message,
      });
    }

    if (error.name === "TaskNotFoundException") {
      return res.status(404).json({
        success: false,
        error: error.message,
      });
    }

    // Validation errors
    if (error.message.includes("required") ||
            error.message.includes("must be") ||
            error.message.includes("Invalid")) {
      return res.status(400).json({
        success: false,
        error: error.message,
      });
    }

    // Repository errors
    if (error.message.includes("Repository error")) {
      return res.status(500).json({
        success: false,
        error: "Database operation failed",
      });
    }

    // Default error
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
    return;
  };
}
