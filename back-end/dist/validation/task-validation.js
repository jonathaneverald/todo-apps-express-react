"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskValidation = void 0;
const zod_1 = require("zod");
class TaskValidation {
}
exports.TaskValidation = TaskValidation;
TaskValidation.CREATE = zod_1.z.object({
    title: zod_1.z.string().min(1).max(200),
    description: zod_1.z.string().min(1).max(1000),
});
TaskValidation.UPDATE = zod_1.z.object({
    id: zod_1.z.number().positive(),
    title: zod_1.z.string().min(1).max(200).optional(),
    description: zod_1.z.string().min(1).max(1000).optional(),
});
TaskValidation.STATUS = zod_1.z.object({
    id: zod_1.z.number().positive(),
    status: zod_1.z.string().min(1).max(200).optional(),
});
TaskValidation.SEARCH = zod_1.z.object({
    title: zod_1.z.string().min(1).max(200).optional(),
    description: zod_1.z.string().min(1).max(1000).optional(),
    status: zod_1.z.string().min(1).max(200).optional(),
    page: zod_1.z.number().min(1).positive(),
    size: zod_1.z.number().min(1).max(100).positive(),
});
