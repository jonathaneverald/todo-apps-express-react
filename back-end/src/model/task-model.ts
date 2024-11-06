import { Task } from "@prisma/client";

export type TaskResponse = {
    id: number;
    title: string;
    description: string;
    status: string;
    created_at: Date;
    updated_at: Date;
};

export type CreateTaskRequest = {
    title: string;
    description: string;
};

export type UpdateTaskRequest = {
    id: number;
    title?: string;
    description?: string;
};

export type UpdateStatusRequest = {
    id: number;
    status?: string;
};

export type SearchTaskRequest = {
    title?: string;
    description?: string;
    status?: string;
    page: number;
    size: number;
};

export const toTaskReponse = (task: Task): TaskResponse => {
    return {
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status,
        created_at: task.created_at,
        updated_at: task.updated_at,
    };
};
