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

export const OwnerAPISchema = z.object({
	id: OwnerDBSchema.shape.id,
	name: OwnerDBSchema.shape.name,
	email: OwnerDBSchema.shape.email,
	phone: OwnerDBSchema.shape.phone,
	businessName: OwnerDBSchema.shape.business_name,
	logoUrl: OwnerDBSchema.shape.logo_url,
	isActive: OwnerDBSchema.shape.is_active,
	createdAt: OwnerDBSchema.shape.created_at,
	updatedAt: OwnerDBSchema.shape.updated_at,
});

export const OwnerResponseSchema = z.object({
	success: z.literal(true),
	message: z.string().optional(),
	data: OwnerAPISchema,
	meta: z.object({ timestamp: z.string() }),
});

export const OwnerListResponseSchema = z.object({
	success: z.literal(true),
	message: z.string().optional(),
	data: z.array(OwnerAPISchema),
	meta: z.object({
		page: z.number(),
		pageSize: z.number(),
		total: z.number(),
		totalPages: z.number(),
		timestamp: z.string(),
	}),
});

export const OwnerListAPISchema = z.array(OwnerAPISchema);

export const GetOwnerSchema = z.object({
	id: OwnerDBSchema.shape.id,
});

export const CreateOwnerAPISchema = z.object({
	name: z.string(),
	email: z.email(),
	phone: z.string().optional(),
	businessName: z.string(),
	logoUrl: z.string().optional(),
});

export const CreateOwnerDBSchema = CreateOwnerAPISchema.transform((data) => ({
	name: data.name,
	email: data.email,
	phone: data.phone || null,
	business_name: data.businessName,
	logo_url: data.logoUrl || null,
}));

export const UpdateOwnerAPIParamsSchema = z.object({
	id: OwnerDBSchema.shape.id,
});

export const UpdateOwnerAPISchema = z.object({
	name: OwnerDBSchema.shape.name.optional(),
	email: OwnerDBSchema.shape.email.optional(),
	phone: OwnerDBSchema.shape.phone.optional(),
	businessName: OwnerDBSchema.shape.business_name.optional(),
	logoUrl: OwnerDBSchema.shape.logo_url.optional(),
	isActive: OwnerDBSchema.shape.is_active.optional(),
});

export const UpdateOwnerDBSchema = z.object({
	name: OwnerDBSchema.shape.name.optional(),
	email: OwnerDBSchema.shape.email.optional(),
	phone: OwnerDBSchema.shape.phone.optional(),
	business_name: OwnerDBSchema.shape.business_name.optional(),
	logo_url: OwnerDBSchema.shape.logo_url.optional(),
	is_active: OwnerDBSchema.shape.is_active.optional(),
});

export const ListOwnersSchema = z.object({
	page: z.coerce.number().min(1).default(1),
	pageSize: z.coerce.number().min(1).max(100).default(10),
	search: z.string().optional(),
	isActive: z.coerce.boolean().optional(),
	sortBy: z.enum(['created_at', 'name', 'business_name']).default('created_at'),
	sortDir: z.enum(['asc', 'desc']).default('desc'),
});
