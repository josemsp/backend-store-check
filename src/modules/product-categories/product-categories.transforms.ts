import { z } from 'zod';
import { ProductCategoryAPISchema, ProductCategoryDBSchema } from './product-categories.schemas';

export function mapProductCategoryDbToApi(data: z.infer<typeof ProductCategoryDBSchema>): z.infer<typeof ProductCategoryAPISchema> {
	return {
		id: data.id,
		ownerId: data.owner_id,
		name: data.name,
		description: data.description,
		isSystem: data.is_system,
		isActive: data.is_active,
		createdAt: data.created_at,
	};
}
