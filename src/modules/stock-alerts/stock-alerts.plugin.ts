import { authMiddleware } from '../../app/middlewares/auth.middleware';
import { WorkerModule } from '../../app/routing/worker.module.registry';
import {
	GetStockAlertController,
	ListStockAlertsController,
	CreateStockAlertController,
	UpdateStockAlertController,
	ResolveStockAlertController,
	DismissStockAlertController,
	DeleteStockAlertController,
} from './stock-alerts.controller';

export const stockAlertsPlugin: WorkerModule = {
	name: 'stock-alerts',
	basePath: '/api/v1/stock-alerts',
	middleware: [authMiddleware],
	routes: [
		{ method: 'get', path: '/', handler: ListStockAlertsController },
		{ method: 'get', path: '/:id', handler: GetStockAlertController },
		{ method: 'post', path: '/', handler: CreateStockAlertController },
		{ method: 'put', path: '/:id', handler: UpdateStockAlertController },
		{ method: 'patch', path: '/:id/resolve', handler: ResolveStockAlertController },
		{ method: 'patch', path: '/:id/dismiss', handler: DismissStockAlertController },
		{ method: 'delete', path: '/:id', handler: DeleteStockAlertController },
	],
};
