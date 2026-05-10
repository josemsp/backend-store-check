import { z } from 'zod';

export const OwnerRelationshipDBSchema = z.object({
	id: z.uuid(),
	requester_id: z.uuid(),
	target_id: z.uuid(),
	status: z.enum(['pending', 'approved', 'rejected', 'suspended']),
	notes: z.string().nullable(),
	created_at: z.iso.datetime({ offset: true }),
	updated_at: z.iso.datetime({ offset: true }),
});

export const OwnerRelationshipAPISchema = z.object({
	id: OwnerRelationshipDBSchema.shape.id,
	requesterId: OwnerRelationshipDBSchema.shape.requester_id,
	targetId: OwnerRelationshipDBSchema.shape.target_id,
	status: OwnerRelationshipDBSchema.shape.status,
	notes: OwnerRelationshipDBSchema.shape.notes,
	createdAt: OwnerRelationshipDBSchema.shape.created_at,
	updatedAt: OwnerRelationshipDBSchema.shape.updated_at,
});

export const OwnerRelationshipResponseSchema = z.object({
	success: z.literal(true),
	message: z.string().optional(),
	data: OwnerRelationshipAPISchema,
	meta: z.object({ timestamp: z.string() }),
});

export const OwnerRelationshipListResponseSchema = z.object({
	success: z.literal(true),
	message: z.string().optional(),
	data: z.array(OwnerRelationshipAPISchema),
	meta: z.object({
		page: z.number(),
		pageSize: z.number(),
		total: z.number(),
		totalPages: z.number(),
		timestamp: z.string(),
	}),
});

export const OwnerRelationshipListAPISchema = z.array(OwnerRelationshipAPISchema);

export const GetOwnerRelationshipSchema = z.object({
	id: OwnerRelationshipDBSchema.shape.id,
});

export const CreateOwnerRelationshipAPISchema = z.object({
	requesterId: z.uuid(),
	targetId: z.uuid(),
	notes: z.string().optional(),
});

export const CreateOwnerRelationshipDBSchema = CreateOwnerRelationshipAPISchema.transform((data) => ({
	requester_id: data.requesterId,
	target_id: data.targetId,
	notes: data.notes || null,
}));

export const UpdateOwnerRelationshipAPIParamsSchema = z.object({
	id: OwnerRelationshipDBSchema.shape.id,
});

export const UpdateOwnerRelationshipAPISchema = z.object({
	status: z.enum(['pending', 'approved', 'rejected', 'suspended']).optional(),
	notes: z.string().optional(),
});

export const UpdateOwnerRelationshipDBSchema = z.object({
	status: z.enum(['pending', 'approved', 'rejected', 'suspended']).optional(),
	notes: z.string().optional(),
});

export const ApproveOwnerRelationshipSchema = z.object({
	id: OwnerRelationshipDBSchema.shape.id,
});

export const RejectOwnerRelationshipSchema = z.object({
	id: OwnerRelationshipDBSchema.shape.id,
	notes: z.string().optional(),
});

export const ListOwnerRelationshipsSchema = z.object({
	page: z.coerce.number().min(1).default(1),
	pageSize: z.coerce.number().min(1).max(100).default(10),
	requesterId: z.uuid().optional(),
	targetId: z.uuid().optional(),
	status: z.enum(['pending', 'approved', 'rejected', 'suspended']).optional(),
	sortBy: z.enum(['created_at', 'status', 'updated_at']).default('created_at'),
	sortDir: z.enum(['asc', 'desc']).default('desc'),
});
