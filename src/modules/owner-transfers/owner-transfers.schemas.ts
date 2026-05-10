import { z } from 'zod';

export const OwnerTransferDBSchema = z.object({
	id: z.uuid(),
	seller_owner_id: z.uuid(),
	buyer_owner_id: z.uuid(),
	from_branch_id: z.uuid(),
	to_branch_id: z.uuid(),
	status: z.enum(['pending', 'sent', 'received', 'cancelled']),
	agreed_price: z.number().nullable(),
	currency: z.enum(['MXN', 'USD', 'EUR']),
	notes: z.string().nullable(),
	created_by: z.uuid().nullable(),
	received_by: z.uuid().nullable(),
	created_at: z.iso.datetime({ offset: true }),
	sent_at: z.iso.datetime({ offset: true }).nullable(),
	received_at: z.iso.datetime({ offset: true }).nullable(),
	updated_at: z.iso.datetime({ offset: true }),
});

export const OwnerTransferAPISchema = z.object({
	id: OwnerTransferDBSchema.shape.id,
	sellerOwnerId: OwnerTransferDBSchema.shape.seller_owner_id,
	buyerOwnerId: OwnerTransferDBSchema.shape.buyer_owner_id,
	fromBranchId: OwnerTransferDBSchema.shape.from_branch_id,
	toBranchId: OwnerTransferDBSchema.shape.to_branch_id,
	status: OwnerTransferDBSchema.shape.status,
	agreedPrice: OwnerTransferDBSchema.shape.agreed_price,
	currency: OwnerTransferDBSchema.shape.currency,
	notes: OwnerTransferDBSchema.shape.notes,
	createdBy: OwnerTransferDBSchema.shape.created_by,
	receivedBy: OwnerTransferDBSchema.shape.received_by,
	createdAt: OwnerTransferDBSchema.shape.created_at,
	sentAt: OwnerTransferDBSchema.shape.sent_at,
	receivedAt: OwnerTransferDBSchema.shape.received_at,
	updatedAt: OwnerTransferDBSchema.shape.updated_at,
});

export const OwnerTransferResponseSchema = z.object({
	success: z.literal(true),
	message: z.string().optional(),
	data: OwnerTransferAPISchema,
	meta: z.object({ timestamp: z.string() }),
});

export const OwnerTransferListResponseSchema = z.object({
	success: z.literal(true),
	message: z.string().optional(),
	data: z.array(OwnerTransferAPISchema),
	meta: z.object({
		page: z.number(),
		pageSize: z.number(),
		total: z.number(),
		totalPages: z.number(),
		timestamp: z.string(),
	}),
});

export const OwnerTransferListAPISchema = z.array(OwnerTransferAPISchema);

export const OwnerTransferItemDBSchema = z.object({
	id: z.uuid(),
	owner_transfer_id: z.uuid(),
	product_id: z.uuid(),
	qty_sent: z.number(),
	qty_received: z.number().nullable(),
	unit_price: z.number(),
	unit_cost: z.number().nullable(),
	notes: z.string().nullable(),
});

export const OwnerTransferItemAPISchema = z.object({
	id: OwnerTransferItemDBSchema.shape.id,
	ownerTransferId: OwnerTransferItemDBSchema.shape.owner_transfer_id,
	productId: OwnerTransferItemDBSchema.shape.product_id,
	qtySent: OwnerTransferItemDBSchema.shape.qty_sent,
	qtyReceived: OwnerTransferItemDBSchema.shape.qty_received,
	unitPrice: OwnerTransferItemDBSchema.shape.unit_price,
	unitCost: OwnerTransferItemDBSchema.shape.unit_cost,
	notes: OwnerTransferItemDBSchema.shape.notes,
});

export const GetOwnerTransferSchema = z.object({
	id: OwnerTransferDBSchema.shape.id,
});

export const CreateOwnerTransferAPISchema = z.object({
	sellerOwnerId: z.uuid(),
	buyerOwnerId: z.uuid(),
	fromBranchId: z.uuid(),
	toBranchId: z.uuid(),
	agreedPrice: z.number().optional(),
	currency: z.enum(['MXN', 'USD', 'EUR']).default('MXN'),
	notes: z.string().optional(),
	createdBy: z.uuid().optional(),
	items: z.array(z.object({
		productId: z.uuid(),
		qtySent: z.number().positive(),
		unitPrice: z.number().positive(),
		unitCost: z.number().optional(),
		notes: z.string().optional(),
	})),
});

export const CreateOwnerTransferDBSchema = CreateOwnerTransferAPISchema.transform((data) => ({
	seller_owner_id: data.sellerOwnerId,
	buyer_owner_id: data.buyerOwnerId,
	from_branch_id: data.fromBranchId,
	to_branch_id: data.toBranchId,
	agreed_price: data.agreedPrice || null,
	currency: data.currency,
	notes: data.notes || null,
	created_by: data.createdBy || null,
	items: data.items.map((item) => ({
		product_id: item.productId,
		qty_sent: item.qtySent,
		unit_price: item.unitPrice,
		unit_cost: item.unitCost || null,
		notes: item.notes || null,
	})),
}));

export const UpdateOwnerTransferAPIParamsSchema = z.object({
	id: OwnerTransferDBSchema.shape.id,
});

export const UpdateOwnerTransferAPISchema = z.object({
	status: z.enum(['pending', 'sent', 'received', 'cancelled']).optional(),
	agreedPrice: z.number().optional(),
	notes: z.string().optional(),
	currency: z.enum(['MXN', 'USD', 'EUR']).optional(),
});

export const UpdateOwnerTransferDBSchema = z.object({
	status: z.enum(['pending', 'sent', 'received', 'cancelled']).optional(),
	agreed_price: z.number().optional(),
	notes: z.string().optional(),
	currency: z.enum(['MXN', 'USD', 'EUR']).optional(),
	sent_at: z.iso.datetime({ offset: true }).nullable().optional(),
	received_at: z.iso.datetime({ offset: true }).nullable().optional(),
	received_by: z.uuid().nullable().optional(),
});

export const ListOwnerTransfersSchema = z.object({
	page: z.coerce.number().min(1).default(1),
	pageSize: z.coerce.number().min(1).max(100).default(10),
	sellerOwnerId: z.uuid().optional(),
	buyerOwnerId: z.uuid().optional(),
	fromBranchId: z.uuid().optional(),
	toBranchId: z.uuid().optional(),
	status: z.enum(['pending', 'sent', 'received', 'cancelled']).optional(),
	currency: z.enum(['MXN', 'USD', 'EUR']).optional(),
	sortBy: z.enum(['created_at', 'status', 'agreed_price']).default('created_at'),
	sortDir: z.enum(['asc', 'desc']).default('desc'),
});
