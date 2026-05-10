import { z } from 'zod';
import { OwnerRelationshipAPISchema, OwnerRelationshipDBSchema } from './owner-relationships.schemas';

export function mapOwnerRelationshipDbToApi(data: z.infer<typeof OwnerRelationshipDBSchema>): z.infer<typeof OwnerRelationshipAPISchema> {
	return {
		id: data.id,
		requesterId: data.requester_id,
		targetId: data.target_id,
		status: data.status,
		notes: data.notes,
		createdAt: data.created_at,
		updatedAt: data.updated_at,
	};
}
