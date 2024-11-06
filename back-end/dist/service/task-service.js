"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskService = void 0;
const task_model_1 = require("../model/task-model");
const validation_1 = require("../validation/validation");
const task_validation_1 = require("../validation/task-validation");
const database_1 = require("../application/database");
const response_error_1 = require("../error/response-error");
class TaskService {
    static create(user, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const createRequest = validation_1.Validation.validate(task_validation_1.TaskValidation.CREATE, request);
            const record = Object.assign(Object.assign(Object.assign({}, createRequest), { status: "Incomplete" }), { username: user.username });
            const task = yield database_1.prismaClient.task.create({
                data: record,
            });
            return (0, task_model_1.toTaskReponse)(task);
        });
    }
    static checkTaskId(username, taskId) {
        return __awaiter(this, void 0, void 0, function* () {
            const task = yield database_1.prismaClient.task.findUnique({
                where: {
                    id: taskId,
                    username: username,
                },
            });
            if (!task) {
                throw new response_error_1.ResponseError(404, "Task not found!");
            }
            return task;
        });
    }
    static get(user, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const task = yield this.checkTaskId(user.username, id);
            return (0, task_model_1.toTaskReponse)(task);
        });
    }
    static update(user, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateRequest = validation_1.Validation.validate(task_validation_1.TaskValidation.UPDATE, request);
            yield this.checkTaskId(user.username, updateRequest.id);
            const task = yield database_1.prismaClient.task.update({
                where: {
                    id: updateRequest.id,
                    username: user.username,
                },
                data: updateRequest,
            });
            return (0, task_model_1.toTaskReponse)(task);
        });
    }
    static updateStatus(user, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateRequest = validation_1.Validation.validate(task_validation_1.TaskValidation.STATUS, request);
            yield this.checkTaskId(user.username, updateRequest.id);
            const task = yield database_1.prismaClient.task.update({
                where: {
                    id: updateRequest.id,
                    username: user.username,
                },
                data: updateRequest,
            });
            return (0, task_model_1.toTaskReponse)(task);
        });
    }
    static delete(user, id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.checkTaskId(user.username, id);
            const task = yield database_1.prismaClient.task.delete({
                where: {
                    id: id,
                    username: user.username,
                },
            });
            return (0, task_model_1.toTaskReponse)(task);
        });
    }
    static search(user, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const searchRequest = validation_1.Validation.validate(task_validation_1.TaskValidation.SEARCH, request);
            const skip = (searchRequest.page - 1) * searchRequest.size;
            const filters = [];
            // Check if title exists
            if (searchRequest.title) {
                filters.push({
                    title: {
                        contains: searchRequest.title,
                    },
                });
            }
            // Check if description exists
            if (searchRequest.description) {
                filters.push({
                    description: {
                        contains: searchRequest.description,
                    },
                });
            }
            // Check if status exists
            if (searchRequest.status) {
                filters.push({
                    status: {
                        contains: searchRequest.status,
                    },
                });
            }
            const tasks = yield database_1.prismaClient.task.findMany({
                where: {
                    username: user.username,
                    AND: filters,
                },
                take: searchRequest.size,
                skip: skip,
            });
            const total = yield database_1.prismaClient.task.count({
                where: {
                    username: user.username,
                    AND: filters,
                },
            });
            return {
                data: tasks.map((task) => (0, task_model_1.toTaskReponse)(task)),
                paging: {
                    current_page: searchRequest.page,
                    total_page: Math.ceil(total / searchRequest.size),
                    size: searchRequest.size,
                },
            };
        });
    }
}
exports.TaskService = TaskService;
