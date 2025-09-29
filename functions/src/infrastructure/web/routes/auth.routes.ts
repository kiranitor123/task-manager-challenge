import {Router} from "express";
import {AuthController} from "../controllers/auth.controller";

export function createAuthRoutes(authController: AuthController): Router {
  const router = Router();

  // GET /users/:email - Find user by email
  router.get("/:email", authController.findUserByEmail);

  // POST /users - Create new user
  router.post("/", authController.createUser);

  return router;
}
