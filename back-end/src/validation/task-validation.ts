import { z, ZodType } from "zod";

export class TaskValidation {
    static readonly CREATE: ZodType = z.object({
        title: z.string().min(1).max(200),
        description: z.string().min(1).max(1000),
    });

    static readonly UPDATE: ZodType = z.object({
        id: z.number().positive(),
        title: z.string().min(1).max(200).optional(),
        description: z.string().min(1).max(1000).optional(),
    });

    static readonly STATUS: ZodType = z.object({
        id: z.number().positive(),
        status: z.string().min(1).max(200).optional(),
    });

    static readonly SEARCH: ZodType = z.object({
        title: z.string().min(1).max(200).optional(),
        description: z.string().min(1).max(1000).optional(),
        status: z.string().min(1).max(200).optional(),
        page: z.number().min(1).positive(),
        size: z.number().min(1).max(100).positive(),
    });
}
