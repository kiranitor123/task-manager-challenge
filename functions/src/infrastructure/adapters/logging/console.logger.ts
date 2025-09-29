import {LoggerPort} from "../../../application/ports/out/logger.port";

export class ConsoleLogger implements LoggerPort {
  info(message: string, meta?: any): void {
    console.log(`[INFO] ${message}`, meta ? JSON.stringify(meta, null, 2) : "");
  }

  warn(message: string, meta?: any): void {
    console.warn(`[WARN] ${message}`, meta ? JSON.stringify(meta, null, 2) : "");
  }

  error(message: string, error?: Error, meta?: any): void {
    console.error(`[ERROR] ${message}`);
    if (error) {
      console.error("Error details:", error.message);
      console.error("Stack trace:", error.stack);
    }
    if (meta) {
      console.error("Metadata:", JSON.stringify(meta, null, 2));
    }
  }

  debug(message: string, meta?: any): void {
    console.debug(`[DEBUG] ${message}`, meta ? JSON.stringify(meta, null, 2) : "");
  }
}
