import { z } from 'zod';
import { ProductUnitAPISchema, ProductUnitDBSchema } from './product-units.schemas';

export function mapProductUnitDbToApi(data: z.infer<typeof ProductUnitDBSchema>): z.infer<typeof ProductUnitAPISchema> {
	return {
		id: data.id,
		ownerId: data.owner_id,
		name: data.name,
		label: data.label,
		description: data.description,
		isSystem: data.is_system,
		isActive: data.is_active,
		createdAt: data.created_at,
	};
}
