import { z } from 'zod';

export const ProductUnitDBSchema = z.object({
	id: z.uuid(),
	owner_id: z.uuid().nullable(),
	name: z.string(),
	label: z.string(),
	description: z.string().nullable(),
	is_system: z.boolean(),
	is_active: z.boolean(),
	created_at: z.iso.datetime({ offset: true }),
});

export const ProductUnitAPISchema = z.object({
	id: ProductUnitDBSchema.shape.id,
	ownerId: ProductUnitDBSchema.shape.owner_id,
	name: ProductUnitDBSchema.shape.name,
	label: ProductUnitDBSchema.shape.label,
	description: ProductUnitDBSchema.shape.description,
	isSystem: ProductUnitDBSchema.shape.is_system,
	isActive: ProductUnitDBSchema.shape.is_active,
	createdAt: ProductUnitDBSchema.shape.created_at,
});

export const ProductUnitResponseSchema = z.object({
	success: z.literal(true),
	message: z.string().optional(),
	data: ProductUnitAPISchema,
	meta: z.object({ timestamp: z.string() }),
});

export const ProductUnitListResponseSchema = z.object({
	success: z.literal(true),
	message: z.string().optional(),
	data: z.array(ProductUnitAPISchema),
	meta: z.object({
		page: z.number(),
		pageSize: z.number(),
		total: z.number(),
		totalPages: z.number(),
		timestamp: z.string(),
	}),
});

export const ProductUnitListAPISchema = z.array(ProductUnitAPISchema);

export const GetProductUnitSchema = z.object({
	id: ProductUnitDBSchema.shape.id,
});

export const CreateProductUnitAPISchema = z.object({
	ownerId: z.uuid().optional(),
	name: z.string(),
	label: z.string(),
	description: z.string().optional(),
});

export const CreateProductUnitDBSchema = CreateProductUnitAPISchema.transform((data) => ({
	owner_id: data.ownerId || null,
	name: data.name,
	label: data.label,
	description: data.description || null,
}));

export const UpdateProductUnitAPIParamsSchema = z.object({
	id: ProductUnitDBSchema.shape.id,
});

export const UpdateProductUnitAPISchema = z.object({
	name: ProductUnitDBSchema.shape.name.optional(),
	label: ProductUnitDBSchema.shape.label.optional(),
	description: ProductUnitDBSchema.shape.description.optional(),
	isActive: ProductUnitDBSchema.shape.is_active.optional(),
});

export const UpdateProductUnitDBSchema = z.object({
	name: ProductUnitDBSchema.shape.name.optional(),
	label: ProductUnitDBSchema.shape.label.optional(),
	description: ProductUnitDBSchema.shape.description.optional(),
	is_active: ProductUnitDBSchema.shape.is_active.optional(),
});

export const ListProductUnitsSchema = z.object({
	page: z.coerce.number().min(1).default(1),
	pageSize: z.coerce.number().min(1).max(100).default(10),
	search: z.string().optional(),
	ownerId: z.uuid().optional(),
	isActive: z.coerce.boolean().optional(),
	isSystem: z.coerce.boolean().optional(),
	sortBy: z.enum(['created_at', 'name', 'label']).default('created_at'),
	sortDir: z.enum(['asc', 'desc']).default('desc'),
});
