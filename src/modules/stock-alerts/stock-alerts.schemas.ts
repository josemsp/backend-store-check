import { z } from 'zod';

export const StockAlertDBSchema = z.object({
	id: z.uuid(),
	owner_id: z.uuid(),
	branch_id: z.uuid(),
	product_id: z.uuid(),
	quantity: z.number(),
	threshold: z.number(),
	status: z.enum(['active', 'resolved', 'dismissed']),
	notified_at: z.iso.datetime({ offset: true }),
	resolved_at: z.iso.datetime({ offset: true }).nullable(),
	resolved_by: z.uuid().nullable(),
});

export const StockAlertAPISchema = z.object({
	id: StockAlertDBSchema.shape.id,
	ownerId: StockAlertDBSchema.shape.owner_id,
	branchId: StockAlertDBSchema.shape.branch_id,
	productId: StockAlertDBSchema.shape.product_id,
	quantity: StockAlertDBSchema.shape.quantity,
	threshold: StockAlertDBSchema.shape.threshold,
	status: StockAlertDBSchema.shape.status,
	notifiedAt: StockAlertDBSchema.shape.notified_at,
	resolvedAt: StockAlertDBSchema.shape.resolved_at,
	resolvedBy: StockAlertDBSchema.shape.resolved_by,
});

export const StockAlertResponseSchema = z.object({
	success: z.literal(true),
	message: z.string().optional(),
	data: StockAlertAPISchema,
	meta: z.object({ timestamp: z.string() }),
});

export const StockAlertListResponseSchema = z.object({
	success: z.literal(true),
	message: z.string().optional(),
	data: z.array(StockAlertAPISchema),
	meta: z.object({
		page: z.number(),
		pageSize: z.number(),
		total: z.number(),
		totalPages: z.number(),
		timestamp: z.string(),
	}),
});

export const StockAlertListAPISchema = z.array(StockAlertAPISchema);

export const GetStockAlertSchema = z.object({
	id: StockAlertDBSchema.shape.id,
});

export const CreateStockAlertAPISchema = z.object({
	ownerId: z.uuid(),
	branchId: z.uuid(),
	productId: z.uuid(),
	quantity: z.number().min(0),
	threshold: z.number().min(0),
	status: z.enum(['active', 'resolved', 'dismissed']).default('active'),
});

export const CreateStockAlertDBSchema = CreateStockAlertAPISchema.transform((data) => ({
	owner_id: data.ownerId,
	branch_id: data.branchId,
	product_id: data.productId,
	quantity: data.quantity,
	threshold: data.threshold,
	status: data.status,
}));

export const UpdateStockAlertAPIParamsSchema = z.object({
	id: StockAlertDBSchema.shape.id,
});

export const UpdateStockAlertAPISchema = z.object({
	quantity: z.number().min(0).optional(),
	threshold: z.number().min(0).optional(),
	status: StockAlertDBSchema.shape.status.optional(),
});

export const UpdateStockAlertDBSchema = z.object({
	quantity: StockAlertDBSchema.shape.quantity.optional(),
	threshold: StockAlertDBSchema.shape.threshold.optional(),
	status: StockAlertDBSchema.shape.status.optional(),
	resolved_at: z.iso.datetime({ offset: true }).nullable().optional(),
	resolved_by: z.uuid().nullable().optional(),
});

export const ListStockAlertsSchema = z.object({
	page: z.coerce.number().min(1).default(1),
	pageSize: z.coerce.number().min(1).max(100).default(10),
	search: z.string().optional(),
	ownerId: z.uuid().optional(),
	branchId: z.uuid().optional(),
	productId: z.uuid().optional(),
	status: z.enum(['active', 'resolved', 'dismissed']).optional(),
	sortBy: z.enum(['notified_at', 'quantity', 'status']).default('notified_at'),
	sortDir: z.enum(['asc', 'desc']).default('desc'),
});
