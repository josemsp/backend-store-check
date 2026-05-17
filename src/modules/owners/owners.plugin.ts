import { authMiddleware } from '../../app/middlewares/auth.middleware';
import { WorkerModule } from '../../app/routing/worker.module.registry';
import { GetOwnerController, ListOwnersController, CreateOwnerController, UpdateOwnerController } from './owners.controller';

export const ownersPlugin: WorkerModule = {
	name: 'owners',
	basePath: '/api/v1/owners',
	middleware: [authMiddleware],
	routes: [
		{ method: 'get', path: '/', handler: ListOwnersController },
		{ method: 'get', path: '/:id', handler: GetOwnerController },
		{ method: 'post', path: '/', handler: CreateOwnerController },
		{ method: 'put', path: '/:id', handler: UpdateOwnerController },
	],
};
