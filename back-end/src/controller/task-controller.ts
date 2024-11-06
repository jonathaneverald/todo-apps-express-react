import { NextFunction, Request, Response } from "express";
import { UserRequest } from "../type/user-request";
import { CreateTaskRequest, SearchTaskRequest, UpdateStatusRequest, UpdateTaskRequest } from "../model/task-model";
import { TaskService } from "../service/task-service";

export class TaskController {
    static async create(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const request: CreateTaskRequest = req.body as CreateTaskRequest;
            const response = await TaskService.create(req.user!, request);
            res.status(201).json({
                data: response,
            });
        } catch (e) {
            next(e);
        }
    }

    static async get(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const taskId = Number(req.params.taskId);
            const response = await TaskService.get(req.user!, taskId);
            res.status(200).json({
                data: response,
            });
        } catch (e) {
            next(e);
        }
    }

    static async update(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const request: UpdateTaskRequest = req.body as UpdateTaskRequest;
            request.id = Number(req.params.taskId);
            const response = await TaskService.update(req.user!, request);
            res.status(200).json({
                data: response,
            });
        } catch (e) {
            next(e);
        }
    }

    static async updateStatus(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const request: UpdateStatusRequest = req.body as UpdateStatusRequest;
            request.id = Number(req.params.taskId);
            const response = await TaskService.updateStatus(req.user!, request);
            res.status(200).json({
                data: response,
            });
        } catch (e) {
            next(e);
        }
    }

    static async delete(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const taskId = Number(req.params.taskId);
            const response = await TaskService.delete(req.user!, taskId);
            res.status(200).json({
                data: "OK",
            });
        } catch (e) {
            next(e);
        }
    }

    static async search(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const request: SearchTaskRequest = {
                title: req.query.title as string,
                description: req.query.description as string,
                status: req.query.status as string,
                page: req.query.page ? Number(req.query.page) : 1,
                size: req.query.size ? Number(req.query.size) : 10,
            };
            const taskId = Number(req.params.taskId);
            const response = await TaskService.search(req.user!, request);
            res.status(200).json(response);
        } catch (e) {
            next(e);
        }
    }
}
