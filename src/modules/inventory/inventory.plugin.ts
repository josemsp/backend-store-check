import { authMiddleware } from '../../app/middlewares/auth.middleware';
import { WorkerModule } from '../../app/routing/worker.module.registry';
import {
	GetInventoryController,
	ListInventoryController,
	CreateInventoryController,
	UpdateInventoryController,
	DeleteInventoryController,
} from './inventory.controller';

export const inventoryPlugin: WorkerModule = {
	name: 'inventory',
	basePath: '/api/v1/inventory',
	middleware: [authMiddleware],
	routes: [
		{ method: 'get', path: '/', handler: ListInventoryController },
		{ method: 'get', path: '/:id', handler: GetInventoryController },
		{ method: 'post', path: '/', handler: CreateInventoryController },
		{ method: 'put', path: '/:id', handler: UpdateInventoryController },
		{ method: 'delete', path: '/:id', handler: DeleteInventoryController },
	],
};
