import { z } from 'zod';
import { NotificationAPISchema, NotificationDBSchema } from './notifications.schemas';

export function mapNotificationDbToApi(data: z.infer<typeof NotificationDBSchema>): z.infer<typeof NotificationAPISchema> {
	return {
		id: data.id,
		ownerId: data.owner_id,
		userId: data.user_id,
		type: data.type,
		title: data.title,
		body: data.body,
		referenceId: data.reference_id,
		referenceType: data.reference_type,
		metadata: data.metadata,
		isRead: data.is_read,
		channel: data.channel,
		platform: data.platform,
		createdAt: data.created_at,
	};
}
