import { z } from "zod";

const MetaSchema = z.object({
    timestamp: z.string()
});

export const ErrorResponseSchema = z.object({
    success: z.literal(false),
    error: z.object({
        code: z.string(),
        message: z.string(),
        details: z.any().optional()
    }),
    meta: MetaSchema
});

export type SuccessResponse<T> = {
    success: true;
    message?: string;
    data: T;
    meta: {
        timestamp: string;
    };
};

export const SuccessResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
    z.object({
        success: z.literal(true),
        message: z.string().optional(),
        data: dataSchema,
        meta: MetaSchema
    }) as unknown as z.ZodType<SuccessResponse<z.infer<T>>>;

export function createSuccessResponseSchema<T extends z.ZodTypeAny>(dataSchema: T) {
    return z.object({
        success: z.literal(true),
        message: z.string().optional(),
        data: dataSchema,
        meta: MetaSchema
    });
}

export function createPaginatedResponseSchema<T extends z.ZodTypeAny>(dataSchema: T) {
    return z.object({
        success: z.literal(true),
        message: z.string().optional(),
        data: z.array(dataSchema),
        meta: MetaSchema.extend({
            pagination: z.object({
                page: z.number(),
                limit: z.number(),
                total: z.number(),
                totalPages: z.number()
            })
        })
    });
}