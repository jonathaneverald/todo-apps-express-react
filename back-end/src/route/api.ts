import express from "express";
import { authMiddleware } from "../middleware/auth-middleware";
import { UserController } from "../controller/user-controller";
import { TaskController } from "../controller/task-controller";

export const apiRouter = express.Router();
apiRouter.use(authMiddleware);

// User API
apiRouter.get("/api/users/current", UserController.get);
apiRouter.patch("/api/users/current", UserController.update);
apiRouter.delete("/api/users/current", UserController.logout);

// Task API
apiRouter.post("/api/tasks", TaskController.create);
apiRouter.get("/api/tasks/:taskId(\\d+)", TaskController.get);
apiRouter.put("/api/tasks/:taskId(\\d+)", TaskController.update);
apiRouter.put("/api/tasks-status/:taskId(\\d+)", TaskController.updateStatus);
apiRouter.delete("/api/tasks/:taskId(\\d+)", TaskController.delete);
apiRouter.get("/api/tasks", TaskController.search);
