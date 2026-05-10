import { z } from 'zod';

export const BranchDBSchema = z.object({
	id: z.uuid(),
	owner_id: z.uuid(),
	name: z.string(),
	type: z.enum(['warehouse', 'point_of_sale']),
	address: z.string().nullable(),
	phone: z.string().nullable(),
	latitude: z.number().nullable(),
	longitude: z.number().nullable(),
	is_active: z.boolean(),
	created_at: z.iso.datetime({ offset: true }),
	updated_at: z.iso.datetime({ offset: true }),
});

export const BranchAPISchema = z.object({
	id: BranchDBSchema.shape.id,
	ownerId: BranchDBSchema.shape.owner_id,
	name: BranchDBSchema.shape.name,
	type: BranchDBSchema.shape.type,
	address: BranchDBSchema.shape.address,
	phone: BranchDBSchema.shape.phone,
	latitude: BranchDBSchema.shape.latitude,
	longitude: BranchDBSchema.shape.longitude,
	isActive: BranchDBSchema.shape.is_active,
	createdAt: BranchDBSchema.shape.created_at,
	updatedAt: BranchDBSchema.shape.updated_at,
});

export const BranchResponseSchema = z.object({
	success: z.literal(true),
	message: z.string().optional(),
	data: BranchAPISchema,
	meta: z.object({ timestamp: z.string() }),
});

export const BranchListResponseSchema = z.object({
	success: z.literal(true),
	message: z.string().optional(),
	data: z.array(BranchAPISchema),
	meta: z.object({
		page: z.number(),
		pageSize: z.number(),
		total: z.number(),
		totalPages: z.number(),
		timestamp: z.string(),
	}),
});

export const BranchListAPISchema = z.array(BranchAPISchema);

export const GetBranchSchema = z.object({
	id: BranchDBSchema.shape.id,
});

export const CreateBranchAPISchema = z.object({
	ownerId: z.uuid(),
	name: z.string(),
	type: BranchDBSchema.shape.type,
	address: z.string().optional(),
	phone: z.string().optional(),
	latitude: z.number().optional(),
	longitude: z.number().optional(),
});

export const CreateBranchDBSchema = CreateBranchAPISchema.transform((data) => ({
	owner_id: data.ownerId,
	name: data.name,
	type: data.type,
	address: data.address || null,
	phone: data.phone || null,
	latitude: data.latitude || null,
	longitude: data.longitude || null,
}));

export const UpdateBranchAPIParamsSchema = z.object({
	id: BranchDBSchema.shape.id,
});

export const UpdateBranchAPISchema = z.object({
	name: BranchDBSchema.shape.name.optional(),
	type: BranchDBSchema.shape.type.optional(),
	address: BranchDBSchema.shape.address.optional(),
	phone: BranchDBSchema.shape.phone.optional(),
	latitude: BranchDBSchema.shape.latitude.optional(),
	longitude: BranchDBSchema.shape.longitude.optional(),
	isActive: BranchDBSchema.shape.is_active.optional(),
});

export const UpdateBranchDBSchema = z.object({
	name: BranchDBSchema.shape.name.optional(),
	type: BranchDBSchema.shape.type.optional(),
	address: BranchDBSchema.shape.address.optional(),
	phone: BranchDBSchema.shape.phone.optional(),
	latitude: BranchDBSchema.shape.latitude.optional(),
	longitude: BranchDBSchema.shape.longitude.optional(),
	is_active: BranchDBSchema.shape.is_active.optional(),
});

export const ListBranchesSchema = z.object({
	page: z.coerce.number().min(1).default(1),
	pageSize: z.coerce.number().min(1).max(100).default(10),
	search: z.string().optional(),
	ownerId: z.uuid().optional(),
	type: BranchDBSchema.shape.type.optional(),
	isActive: z.coerce.boolean().optional(),
	sortBy: z.enum(['created_at', 'name', 'type']).default('created_at'),
	sortDir: z.enum(['asc', 'desc']).default('desc'),
});
