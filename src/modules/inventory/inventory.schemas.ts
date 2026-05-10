import { z } from 'zod';

export const InventoryDBSchema = z.object({
	id: z.uuid(),
	owner_id: z.uuid(),
	branch_id: z.uuid(),
	product_id: z.uuid(),
	quantity: z.number(),
	updated_at: z.iso.datetime({ offset: true }),
});

export const InventoryAPISchema = z.object({
	id: InventoryDBSchema.shape.id,
	ownerId: InventoryDBSchema.shape.owner_id,
	branchId: InventoryDBSchema.shape.branch_id,
	productId: InventoryDBSchema.shape.product_id,
	quantity: InventoryDBSchema.shape.quantity,
	updatedAt: InventoryDBSchema.shape.updated_at,
});

export const InventoryResponseSchema = z.object({
	success: z.literal(true),
	message: z.string().optional(),
	data: InventoryAPISchema,
	meta: z.object({ timestamp: z.string() }),
});

export const InventoryListResponseSchema = z.object({
	success: z.literal(true),
	message: z.string().optional(),
	data: z.array(InventoryAPISchema),
	meta: z.object({
		page: z.number(),
		pageSize: z.number(),
		total: z.number(),
		totalPages: z.number(),
		timestamp: z.string(),
	}),
});

export const InventoryListAPISchema = z.array(InventoryAPISchema);

export const GetInventorySchema = z.object({
	id: InventoryDBSchema.shape.id,
});

export const CreateInventoryAPISchema = z.object({
	ownerId: z.uuid(),
	branchId: z.uuid(),
	productId: z.uuid(),
	quantity: z.number().min(0).default(0),
});

export const CreateInventoryDBSchema = CreateInventoryAPISchema.transform((data) => ({
	owner_id: data.ownerId,
	branch_id: data.branchId,
	product_id: data.productId,
	quantity: data.quantity,
}));

export const UpdateInventoryAPIParamsSchema = z.object({
	id: InventoryDBSchema.shape.id,
});

export const UpdateInventoryAPISchema = z.object({
	quantity: z.number().min(0).optional(),
});

export const UpdateInventoryDBSchema = z.object({
	quantity: InventoryDBSchema.shape.quantity.optional(),
});

export const ListInventorySchema = z.object({
	page: z.coerce.number().min(1).default(1),
	pageSize: z.coerce.number().min(1).max(100).default(10),
	search: z.string().optional(),
	ownerId: z.uuid().optional(),
	branchId: z.uuid().optional(),
	productId: z.uuid().optional(),
	sortBy: z.enum(['updated_at', 'quantity']).default('updated_at'),
	sortDir: z.enum(['asc', 'desc']).default('desc'),
});
