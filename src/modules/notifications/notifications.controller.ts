import { NotificationsService } from './notifications.services';
import { Context } from 'hono';
import { z } from 'zod';
import { mapNotificationDbToApi } from './notifications.transforms';
import { BaseController } from '../../shared/utils/base.controller';
import { serverError, successResponse } from '../../shared/utils/response';
import {
	GetNotificationSchema,
	ListNotificationsSchema,
	UpdateNotificationAPIParamsSchema,
	UpdateNotificationAPISchema,
	NotificationAPISchema,
	NotificationListAPISchema,
	CreateNotificationAPISchema,
	CreateNotificationDBSchema,
	MarkAsReadSchema,
} from './notifications.schemas';
import { AppContext } from '../../shared/supabase/general';

export class GetNotificationController extends BaseController {
	schema = {
		tags: ['Notifications'],
		summary: 'Get a notification',
		operationId: 'getNotification',
		security: [{ bearerAuth: [] }],
		request: {
			params: GetNotificationSchema,
		},
		responses: this.createStandardResponses(NotificationAPISchema, {
			successDescription: 'Notification retrieved successfully',
			includeAuth: true,
			include404: true,
		}),
	};

	async handle(c: Context<AppContext>) {
		const service = new NotificationsService(c.get('supabase'));
		const notification = await service.getOne(c.req.param('id'));

		if (!notification) {
			return c.json({ error: 'Notification not found' }, 404);
		}

		return successResponse(c, mapNotificationDbToApi(notification));
	}
}

export class ListNotificationsController extends BaseController {
	schema = {
		tags: ['Notifications'],
		summary: 'List notifications',
		operationId: 'listNotifications',
		security: [{ bearerAuth: [] }],
		request: {
			query: ListNotificationsSchema,
		},
		responses: this.createStandardResponses(NotificationAPISchema, {
			successDescription: 'Notifications retrieved',
			include400: true,
			includeAuth: true,
		}),
	};

	async handle(c: Context<AppContext>) {
		const service = new NotificationsService(c.get('supabase'));
		const query = c.req.valid('query');
		const result = await service.list(query);
		const mappedData = result.data.map((n) => mapNotificationDbToApi(n));
		return successResponse(c, { data: mappedData, meta: result.meta });
	}
}

export class CreateNotificationController extends BaseController {
	schema = {
		tags: ['Notifications'],
		summary: 'Create a notification',
		operationId: 'createNotification',
		security: [{ bearerAuth: [] }],
		request: {
			body: this.createBodySchema(CreateNotificationAPISchema),
		},
		responses: this.createStandardResponses(NotificationAPISchema, {
			successDescription: 'Notification created',
			include400: true,
			includeAuth: true,
		}),
	};

	async handle(c: Context<AppContext>) {
		const data = await this.getValidatedData<typeof this.schema>();
		const payload = CreateNotificationDBSchema.parse(data.body);
		const service = new NotificationsService(c.get('supabase'));
		const result = await service.create(payload);
		return successResponse(c, mapNotificationDbToApi(result), 'Notification created');
	}
}

export class UpdateNotificationController extends BaseController {
	schema = {
		tags: ['Notifications'],
		summary: 'Update a notification',
		operationId: 'updateNotification',
		security: [{ bearerAuth: [] }],
		request: {
			params: UpdateNotificationAPIParamsSchema,
			body: this.createBodySchema(UpdateNotificationAPISchema),
		},
		responses: this.createStandardResponses(NotificationAPISchema, {
			successDescription: 'Notification updated',
			include400: true,
			includeAuth: true,
			include404: true,
		}),
	};

	async handle(c: Context<AppContext>) {
		const data = await this.getValidatedData<typeof this.schema>();
		const service = new NotificationsService(c.get('supabase'));

		const updatePayload: any = {};
		if (data.body.isRead !== undefined) updatePayload.is_read = data.body.isRead;

		const result = await service.update(data.params.id, updatePayload);
		return successResponse(c, mapNotificationDbToApi(result), 'Notification updated');
	}
}

export class MarkAsReadController extends BaseController {
	schema = {
		tags: ['Notifications'],
		summary: 'Mark notifications as read',
		operationId: 'markNotificationsAsRead',
		security: [{ bearerAuth: [] }],
		request: {
			body: this.createBodySchema(MarkAsReadSchema),
		},
		responses: this.createStandardResponses(NotificationListAPISchema, {
			successDescription: 'Notifications marked as read',
			include400: true,
			includeAuth: true,
		}),
	};

	async handle(c: Context<AppContext>) {
		const data = await this.getValidatedData<typeof this.schema>();
		const service = new NotificationsService(c.get('supabase'));
		const result = await service.markAsRead(data.body.ids);
		const mappedData = result.map((n) => mapNotificationDbToApi(n));
		return successResponse(c, mappedData, 'Notifications marked as read');
	}
}

export class MarkAllAsReadController extends BaseController {
	schema = {
		tags: ['Notifications'],
		summary: 'Mark all notifications as read',
		operationId: 'markAllNotificationsAsRead',
		security: [{ bearerAuth: [] }],
		request: {
			body: this.createBodySchema(z.object({
				ownerId: z.uuid(),
				userId: z.uuid().optional(),
			})),
		},
		responses: this.createStandardResponses(NotificationListAPISchema, {
			successDescription: 'All notifications marked as read',
			include400: true,
			includeAuth: true,
		}),
	};

	async handle(c: Context<AppContext>) {
		const data = await this.getValidatedData<typeof this.schema>();
		const service = new NotificationsService(c.get('supabase'));
		const result = await service.markAllAsRead(data.body.ownerId, data.body.userId);
		const mappedData = result.map((n) => mapNotificationDbToApi(n));
		return successResponse(c, mappedData, 'All notifications marked as read');
	}
}

export class DeleteNotificationController extends BaseController {
	schema = {
		tags: ['Notifications'],
		summary: 'Delete a notification',
		operationId: 'deleteNotification',
		security: [{ bearerAuth: [] }],
		request: {
			params: GetNotificationSchema,
		},
		responses: this.createStandardResponses(null, {
			successDescription: 'Notification deleted',
			includeAuth: true,
			include404: true,
		}),
	};

	async handle(c: Context<AppContext>) {
		const service = new NotificationsService(c.get('supabase'));
		await service.delete(c.req.param('id'));
		return successResponse(c, null, 'Notification deleted');
	}
}
