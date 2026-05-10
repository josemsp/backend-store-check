import { z } from 'zod';
import { TransferAPISchema, TransferDBSchema, TransferItemAPISchema, TransferItemDBSchema } from './transfers.schemas';

export function mapTransferDbToApi(data: z.infer<typeof TransferDBSchema>): z.infer<typeof TransferAPISchema> {
	return {
		id: data.id,
		ownerId: data.owner_id,
		fromBranchId: data.from_branch_id,
		toBranchId: data.to_branch_id,
		status: data.status,
		transferType: data.transfer_type,
		notes: data.notes,
		createdBy: data.created_by,
		receivedBy: data.received_by,
		createdAt: data.created_at,
		sentAt: data.sent_at,
		receivedAt: data.received_at,
		updatedAt: data.updated_at,
	};
}

export function mapTransferItemDbToApi(data: z.infer<typeof TransferItemDBSchema>): z.infer<typeof TransferItemAPISchema> {
	return {
		id: data.id,
		transferId: data.transfer_id,
		productId: data.product_id,
		qtySent: data.qty_sent,
		qtyReceived: data.qty_received,
		unitCost: data.unit_cost,
		notes: data.notes,
	};
}
