import { z } from 'zod';

export const ProductCategoryDBSchema = z.object({
	id: z.uuid(),
	owner_id: z.uuid().nullable(),
	name: z.string(),
	description: z.string().nullable(),
	is_system: z.boolean(),
	is_active: z.boolean(),
	created_at: z.iso.datetime({ offset: true }),
});

export const ProductCategoryAPISchema = z.object({
	id: ProductCategoryDBSchema.shape.id,
	ownerId: ProductCategoryDBSchema.shape.owner_id,
	name: ProductCategoryDBSchema.shape.name,
	description: ProductCategoryDBSchema.shape.description,
	isSystem: ProductCategoryDBSchema.shape.is_system,
	isActive: ProductCategoryDBSchema.shape.is_active,
	createdAt: ProductCategoryDBSchema.shape.created_at,
});

export const ProductCategoryResponseSchema = z.object({
	success: z.literal(true),
	message: z.string().optional(),
	data: ProductCategoryAPISchema,
	meta: z.object({ timestamp: z.string() }),
});

export const ProductCategoryListResponseSchema = z.object({
	success: z.literal(true),
	message: z.string().optional(),
	data: z.array(ProductCategoryAPISchema),
	meta: z.object({
		page: z.number(),
		pageSize: z.number(),
		total: z.number(),
		totalPages: z.number(),
		timestamp: z.string(),
	}),
});

export const ProductCategoryListAPISchema = z.array(ProductCategoryAPISchema);

export const GetProductCategorySchema = z.object({
	id: ProductCategoryDBSchema.shape.id,
});

export const CreateProductCategoryAPISchema = z.object({
	ownerId: z.uuid().optional(),
	name: z.string(),
	description: z.string().optional(),
});

export const CreateProductCategoryDBSchema = CreateProductCategoryAPISchema.transform((data) => ({
	owner_id: data.ownerId || null,
	name: data.name,
	description: data.description || null,
}));

export const UpdateProductCategoryAPIParamsSchema = z.object({
	id: ProductCategoryDBSchema.shape.id,
});

export const UpdateProductCategoryAPISchema = z.object({
	name: ProductCategoryDBSchema.shape.name.optional(),
	description: ProductCategoryDBSchema.shape.description.optional(),
	isActive: ProductCategoryDBSchema.shape.is_active.optional(),
});

export const UpdateProductCategoryDBSchema = z.object({
	name: ProductCategoryDBSchema.shape.name.optional(),
	description: ProductCategoryDBSchema.shape.description.optional(),
	is_active: ProductCategoryDBSchema.shape.is_active.optional(),
});

export const ListProductCategoriesSchema = z.object({
	page: z.coerce.number().min(1).default(1),
	pageSize: z.coerce.number().min(1).max(100).default(10),
	search: z.string().optional(),
	ownerId: z.uuid().optional(),
	isActive: z.coerce.boolean().optional(),
	isSystem: z.coerce.boolean().optional(),
	sortBy: z.enum(['created_at', 'name']).default('created_at'),
	sortDir: z.enum(['asc', 'desc']).default('desc'),
});
