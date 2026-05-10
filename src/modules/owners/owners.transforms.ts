import { z } from 'zod';
import { OwnerAPISchema, OwnerDBSchema } from './owners.schemas';

export function mapOwnerDbToApi(data: z.infer<typeof OwnerDBSchema>): z.infer<typeof OwnerAPISchema> {
	return {
		id: data.id,
		name: data.name,
		email: data.email,
		phone: data.phone,
		businessName: data.business_name,
		logoUrl: data.logo_url,
		isActive: data.is_active,
		createdAt: data.created_at,
		updatedAt: data.updated_at,
	};
}
