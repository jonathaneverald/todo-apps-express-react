import { Task, User } from "@prisma/client";
import { CreateTaskRequest, SearchTaskRequest, TaskResponse, toTaskReponse, UpdateStatusRequest, UpdateTaskRequest } from "../model/task-model";
import { Validation } from "../validation/validation";
import { TaskValidation } from "../validation/task-validation";
import { prismaClient } from "../application/database";
import { ResponseError } from "../error/response-error";
import { Pageable } from "../model/page";

export class TaskService {
    static async create(user: User, request: CreateTaskRequest): Promise<TaskResponse> {
        const createRequest = Validation.validate(TaskValidation.CREATE, request);

        const record = {
            ...createRequest,
            ...{ status: "Incomplete" },
            ...{ username: user.username },
        };

        const task = await prismaClient.task.create({
            data: record,
        });

        return toTaskReponse(task);
    }

    static async checkTaskId(username: string, taskId: number): Promise<Task> {
        const task = await prismaClient.task.findUnique({
            where: {
                id: taskId,
                username: username,
            },
        });

        if (!task) {
            throw new ResponseError(404, "Task not found!");
        }

        return task;
    }

    static async get(user: User, id: number): Promise<TaskResponse> {
        const task = await this.checkTaskId(user.username, id);
        return toTaskReponse(task);
    }

    static async update(user: User, request: UpdateTaskRequest): Promise<TaskResponse> {
        const updateRequest = Validation.validate(TaskValidation.UPDATE, request);
        await this.checkTaskId(user.username, updateRequest.id);

        const task = await prismaClient.task.update({
            where: {
                id: updateRequest.id,
                username: user.username,
            },
            data: updateRequest,
        });

        return toTaskReponse(task);
    }

    static async updateStatus(user: User, request: UpdateStatusRequest): Promise<TaskResponse> {
        const updateRequest = Validation.validate(TaskValidation.STATUS, request);
        await this.checkTaskId(user.username, updateRequest.id);

        const task = await prismaClient.task.update({
            where: {
                id: updateRequest.id,
                username: user.username,
            },
            data: updateRequest,
        });

        return toTaskReponse(task);
    }

    static async delete(user: User, id: number): Promise<TaskResponse> {
        await this.checkTaskId(user.username, id);

        const task = await prismaClient.task.delete({
            where: {
                id: id,
                username: user.username,
            },
        });

        return toTaskReponse(task);
    }

    static async search(user: User, request: SearchTaskRequest): Promise<Pageable<TaskResponse>> {
        const searchRequest = Validation.validate(TaskValidation.SEARCH, request);
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

        const tasks = await prismaClient.task.findMany({
            where: {
                username: user.username,
                AND: filters,
            },
            take: searchRequest.size,
            skip: skip,
        });

        const total = await prismaClient.task.count({
            where: {
                username: user.username,
                AND: filters,
            },
        });

        return {
            data: tasks.map((task) => toTaskReponse(task)),
            paging: {
                current_page: searchRequest.page,
                total_page: Math.ceil(total / searchRequest.size),
                size: searchRequest.size,
            },
        };
    }
}
