import { z } from 'zod';

export const NotificationDBSchema = z.object({
	id: z.uuid(),
	owner_id: z.uuid(),
	user_id: z.uuid().nullable(),
	type: z.enum(['stock_alert', 'transfer_request', 'transfer_received', 'owner_transfer', 'system']),
	title: z.string(),
	body: z.string(),
	reference_id: z.uuid().nullable(),
	reference_type: z.string().nullable(),
	metadata: z.any(),
	is_read: z.boolean(),
	channel: z.enum(['in_app', 'email', 'push', 'sms']),
	platform: z.enum(['all', 'web', 'mobile', 'desktop']),
	created_at: z.iso.datetime({ offset: true }),
});

export const NotificationAPISchema = z.object({
	id: NotificationDBSchema.shape.id,
	ownerId: NotificationDBSchema.shape.owner_id,
	userId: NotificationDBSchema.shape.user_id,
	type: NotificationDBSchema.shape.type,
	title: NotificationDBSchema.shape.title,
	body: NotificationDBSchema.shape.body,
	referenceId: NotificationDBSchema.shape.reference_id,
	referenceType: NotificationDBSchema.shape.reference_type,
	metadata: NotificationDBSchema.shape.metadata,
	isRead: NotificationDBSchema.shape.is_read,
	channel: NotificationDBSchema.shape.channel,
	platform: NotificationDBSchema.shape.platform,
	createdAt: NotificationDBSchema.shape.created_at,
});

export const NotificationResponseSchema = z.object({
	success: z.literal(true),
	message: z.string().optional(),
	data: NotificationAPISchema,
	meta: z.object({ timestamp: z.string() }),
});

export const NotificationListResponseSchema = z.object({
	success: z.literal(true),
	message: z.string().optional(),
	data: z.array(NotificationAPISchema),
	meta: z.object({
		page: z.number(),
		pageSize: z.number(),
		total: z.number(),
		totalPages: z.number(),
		timestamp: z.string(),
	}),
});

export const NotificationListAPISchema = z.array(NotificationAPISchema);

export const GetNotificationSchema = z.object({
	id: NotificationDBSchema.shape.id,
});

export const CreateNotificationAPISchema = z.object({
	ownerId: z.uuid(),
	userId: z.uuid().optional(),
	type: z.enum(['stock_alert', 'transfer_request', 'transfer_received', 'owner_transfer', 'system']),
	title: z.string(),
	body: z.string(),
	referenceId: z.uuid().optional(),
	referenceType: z.string().optional(),
	metadata: z.any().optional(),
	channel: z.enum(['in_app', 'email', 'push', 'sms']).default('in_app'),
	platform: z.enum(['all', 'web', 'mobile', 'desktop']).default('all'),
});

export const CreateNotificationDBSchema = CreateNotificationAPISchema.transform((data) => ({
	owner_id: data.ownerId,
	user_id: data.userId || null,
	type: data.type,
	title: data.title,
	body: data.body,
	reference_id: data.referenceId || null,
	reference_type: data.referenceType || null,
	metadata: data.metadata || {},
	channel: data.channel,
	platform: data.platform,
}));

export const UpdateNotificationAPIParamsSchema = z.object({
	id: NotificationDBSchema.shape.id,
});

export const UpdateNotificationAPISchema = z.object({
	isRead: z.boolean().optional(),
});

export const UpdateNotificationDBSchema = z.object({
	is_read: z.boolean().optional(),
});

export const MarkAsReadSchema = z.object({
	ids: z.array(z.uuid()),
});

export const ListNotificationsSchema = z.object({
	page: z.coerce.number().min(1).default(1),
	pageSize: z.coerce.number().min(1).max(100).default(10),
	ownerId: z.uuid().optional(),
	userId: z.uuid().optional(),
	type: z.enum(['stock_alert', 'transfer_request', 'transfer_received', 'owner_transfer', 'system']).optional(),
	isRead: z.coerce.boolean().optional(),
	channel: z.enum(['in_app', 'email', 'push', 'sms']).optional(),
	platform: z.enum(['all', 'web', 'mobile', 'desktop']).optional(),
	sortBy: z.enum(['created_at', 'type', 'is_read']).default('created_at'),
	sortDir: z.enum(['asc', 'desc']).default('desc'),
});
