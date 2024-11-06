"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiRouter = void 0;
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middleware/auth-middleware");
const user_controller_1 = require("../controller/user-controller");
const task_controller_1 = require("../controller/task-controller");
exports.apiRouter = express_1.default.Router();
exports.apiRouter.use(auth_middleware_1.authMiddleware);
// User API
exports.apiRouter.get("/api/users/current", user_controller_1.UserController.get);
exports.apiRouter.patch("/api/users/current", user_controller_1.UserController.update);
exports.apiRouter.delete("/api/users/current", user_controller_1.UserController.logout);
// Task API
exports.apiRouter.post("/api/tasks", task_controller_1.TaskController.create);
exports.apiRouter.get("/api/tasks/:taskId(\\d+)", task_controller_1.TaskController.get);
exports.apiRouter.put("/api/tasks/:taskId(\\d+)", task_controller_1.TaskController.update);
exports.apiRouter.put("/api/tasks-status/:taskId(\\d+)", task_controller_1.TaskController.updateStatus);
exports.apiRouter.delete("/api/tasks/:taskId(\\d+)", task_controller_1.TaskController.delete);
exports.apiRouter.get("/api/tasks", task_controller_1.TaskController.search);
