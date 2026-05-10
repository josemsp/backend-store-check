import { z } from 'zod';
import { StockAlertAPISchema, StockAlertDBSchema } from './stock-alerts.schemas';

export function mapStockAlertDbToApi(data: z.infer<typeof StockAlertDBSchema>): z.infer<typeof StockAlertAPISchema> {
	return {
		id: data.id,
		ownerId: data.owner_id,
		branchId: data.branch_id,
		productId: data.product_id,
		quantity: data.quantity,
		threshold: data.threshold,
		status: data.status,
		notifiedAt: data.notified_at,
		resolvedAt: data.resolved_at,
		resolvedBy: data.resolved_by,
	};
}
