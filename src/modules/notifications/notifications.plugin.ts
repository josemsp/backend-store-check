import { authMiddleware } from '../../app/middlewares/auth.middleware';
import { WorkerModule } from '../../app/routing/worker.module.registry';
import {
	GetNotificationController,
	ListNotificationsController,
	CreateNotificationController,
	UpdateNotificationController,
	MarkAsReadController,
	MarkAllAsReadController,
	DeleteNotificationController,
} from './notifications.controller';

export const notificationsPlugin: WorkerModule = {
	name: 'notifications',
	basePath: '/api/v1/notifications',
	middleware: [authMiddleware],
	routes: [
		{ method: 'get', path: '/', handler: ListNotificationsController },
		{ method: 'get', path: '/:id', handler: GetNotificationController },
		{ method: 'post', path: '/', handler: CreateNotificationController },
		{ method: 'put', path: '/:id', handler: UpdateNotificationController },
		{ method: 'patch', path: '/mark-as-read', handler: MarkAsReadController },
		{ method: 'patch', path: '/mark-all-as-read', handler: MarkAllAsReadController },
		{ method: 'delete', path: '/:id', handler: DeleteNotificationController },
	],
};
