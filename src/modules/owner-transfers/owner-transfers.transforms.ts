import { z } from 'zod';
import { OwnerTransferAPISchema, OwnerTransferDBSchema, OwnerTransferItemAPISchema, OwnerTransferItemDBSchema } from './owner-transfers.schemas';

export function mapOwnerTransferDbToApi(data: z.infer<typeof OwnerTransferDBSchema>): z.infer<typeof OwnerTransferAPISchema> {
	return {
		id: data.id,
		sellerOwnerId: data.seller_owner_id,
		buyerOwnerId: data.buyer_owner_id,
		fromBranchId: data.from_branch_id,
		toBranchId: data.to_branch_id,
		status: data.status,
		agreedPrice: data.agreed_price,
		currency: data.currency,
		notes: data.notes,
		createdBy: data.created_by,
		receivedBy: data.received_by,
		createdAt: data.created_at,
		sentAt: data.sent_at,
		receivedAt: data.received_at,
		updatedAt: data.updated_at,
	};
}

export function mapOwnerTransferItemDbToApi(data: z.infer<typeof OwnerTransferItemDBSchema>): z.infer<typeof OwnerTransferItemAPISchema> {
	return {
		id: data.id,
		ownerTransferId: data.owner_transfer_id,
		productId: data.product_id,
		qtySent: data.qty_sent,
		qtyReceived: data.qty_received,
		unitPrice: data.unit_price,
		unitCost: data.unit_cost,
		notes: data.notes,
	};
}
