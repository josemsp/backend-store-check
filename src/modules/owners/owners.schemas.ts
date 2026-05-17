import { z } from 'zod';

export const OwnerDBSchema = z.object({
	id: z.uuid(),
	name: z.string(),
	email: z.email(),
	phone: z.string().nullable(),
	business_name: z.string(),
	logo_url: z.string().nullable(),
	is_active: z.boolean(),
	created_at: z.iso.datetime({ offset: true }),
	updated_at: z.iso.datetime({ offset: true }),
});

export const OwnerResponseSchema = z.object({
	success: z.literal(true),
	message: z.string().optional(),
	data: OwnerDBSchema,
	meta: z.object({ timestamp: z.string() }),
});

export const OwnerListResponseSchema = z.object({
	success: z.literal(true),
	message: z.string().optional(),
	data: z.array(OwnerDBSchema),
	meta: z.object({
		page: z.number(),
		page_size: z.number(),
		total: z.number(),
		total_pages: z.number(),
		timestamp: z.string(),
	}),
});

export const OwnerListAPISchema = z.array(OwnerDBSchema);

export const GetOwnerSchema = z.object({
	id: OwnerDBSchema.shape.id,
});

export const CreateOwnerAPISchema = z.object({
	name: z.string(),
	email: z.email(),
	phone: z.string().optional(),
	business_name: z.string(),
	logo_url: z.string().optional(),
});

export const UpdateOwnerAPIParamsSchema = z.object({
	id: OwnerDBSchema.shape.id,
});

export const UpdateOwnerAPISchema = z.object({
	name: z.string().optional(),
	email: z.email().optional(),
	phone: z.string().optional(),
	business_name: z.string().optional(),
	logo_url: z.string().optional(),
	is_active: z.boolean().optional(),
});

export const ListOwnersSchema = z.object({
	page: z.coerce.number().min(1).default(1),
	page_size: z.coerce.number().min(1).max(100).default(10),
	search: z.string().optional(),
	is_active: z.coerce.boolean().optional(),
	sort_by: z.enum(['created_at', 'name', 'business_name']).default('created_at'),
	sort_dir: z.enum(['asc', 'desc']).default('desc'),
});
