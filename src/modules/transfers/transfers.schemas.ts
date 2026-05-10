import { z } from 'zod';

export const TransferDBSchema = z.object({
	id: z.uuid(),
	owner_id: z.uuid(),
	from_branch_id: z.uuid().nullable(),
	to_branch_id: z.uuid(),
	status: z.enum(['pending', 'sent', 'received', 'cancelled']),
	transfer_type: z.enum(['internal', 'external']),
	notes: z.string().nullable(),
	created_by: z.uuid().nullable(),
	received_by: z.uuid().nullable(),
	created_at: z.iso.datetime({ offset: true }),
	sent_at: z.iso.datetime({ offset: true }).nullable(),
	received_at: z.iso.datetime({ offset: true }).nullable(),
	updated_at: z.iso.datetime({ offset: true }),
});

export const TransferAPISchema = z.object({
	id: TransferDBSchema.shape.id,
	ownerId: TransferDBSchema.shape.owner_id,
	fromBranchId: TransferDBSchema.shape.from_branch_id,
	toBranchId: TransferDBSchema.shape.to_branch_id,
	status: TransferDBSchema.shape.status,
	transferType: TransferDBSchema.shape.transfer_type,
	notes: TransferDBSchema.shape.notes,
	createdBy: TransferDBSchema.shape.created_by,
	receivedBy: TransferDBSchema.shape.received_by,
	createdAt: TransferDBSchema.shape.created_at,
	sentAt: TransferDBSchema.shape.sent_at,
	receivedAt: TransferDBSchema.shape.received_at,
	updatedAt: TransferDBSchema.shape.updated_at,
});

export const TransferResponseSchema = z.object({
	success: z.literal(true),
	message: z.string().optional(),
	data: TransferAPISchema,
	meta: z.object({ timestamp: z.string() }),
});

export const TransferListResponseSchema = z.object({
	success: z.literal(true),
	message: z.string().optional(),
	data: z.array(TransferAPISchema),
	meta: z.object({
		page: z.number(),
		pageSize: z.number(),
		total: z.number(),
		totalPages: z.number(),
		timestamp: z.string(),
	}),
});

export const TransferListAPISchema = z.array(TransferAPISchema);

export const TransferItemDBSchema = z.object({
	id: z.uuid(),
	transfer_id: z.uuid(),
	product_id: z.uuid(),
	qty_sent: z.number(),
	qty_received: z.number().nullable(),
	unit_cost: z.number().nullable(),
	notes: z.string().nullable(),
});

export const TransferItemAPISchema = z.object({
	id: TransferItemDBSchema.shape.id,
	transferId: TransferItemDBSchema.shape.transfer_id,
	productId: TransferItemDBSchema.shape.product_id,
	qtySent: TransferItemDBSchema.shape.qty_sent,
	qtyReceived: TransferItemDBSchema.shape.qty_received,
	unitCost: TransferItemDBSchema.shape.unit_cost,
	notes: TransferItemDBSchema.shape.notes,
});

export const GetTransferSchema = z.object({
	id: TransferDBSchema.shape.id,
});

export const CreateTransferAPISchema = z.object({
	ownerId: z.uuid(),
	fromBranchId: z.uuid().nullable().optional(),
	toBranchId: z.uuid(),
	transferType: z.enum(['internal', 'external']),
	notes: z.string().optional(),
	items: z.array(z.object({
		productId: z.uuid(),
		qtySent: z.number().positive(),
		unitCost: z.number().optional(),
		notes: z.string().optional(),
	})),
});

export const CreateTransferDBSchema = CreateTransferAPISchema.transform((data) => ({
	owner_id: data.ownerId,
	from_branch_id: data.fromBranchId || null,
	to_branch_id: data.toBranchId,
	transfer_type: data.transferType,
	notes: data.notes || null,
	items: data.items.map((item) => ({
		product_id: item.productId,
		qty_sent: item.qtySent,
		unit_cost: item.unitCost || null,
		notes: item.notes || null,
	})),
}));

export const UpdateTransferAPIParamsSchema = z.object({
	id: TransferDBSchema.shape.id,
});

export const UpdateTransferAPISchema = z.object({
	status: TransferDBSchema.shape.status.optional(),
	notes: TransferDBSchema.shape.notes.optional(),
});

export const UpdateTransferDBSchema = z.object({
	status: TransferDBSchema.shape.status.optional(),
	notes: TransferDBSchema.shape.notes.optional(),
	sent_at: z.iso.datetime({ offset: true }).nullable().optional(),
	received_at: z.iso.datetime({ offset: true }).nullable().optional(),
	received_by: z.uuid().nullable().optional(),
});

export const ListTransfersSchema = z.object({
	page: z.coerce.number().min(1).default(1),
	pageSize: z.coerce.number().min(1).max(100).default(10),
	search: z.string().optional(),
	ownerId: z.uuid().optional(),
	fromBranchId: z.uuid().optional(),
	toBranchId: z.uuid().optional(),
	status: z.enum(['pending', 'sent', 'received', 'cancelled']).optional(),
	transferType: z.enum(['internal', 'external']).optional(),
	sortBy: z.enum(['created_at', 'status', 'transfer_type']).default('created_at'),
	sortDir: z.enum(['asc', 'desc']).default('desc'),
});
