"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toTaskReponse = void 0;
const toTaskReponse = (task) => {
    return {
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status,
        created_at: task.created_at,
        updated_at: task.updated_at,
    };
};
exports.toTaskReponse = toTaskReponse;
