import { authMiddleware } from '../../app/middlewares/auth.middleware';
import { WorkerModule } from '../../app/routing/worker.module.registry';
import {
	GetMeOwnerController,
	GetOwnerController,
	ListOwnersController,
	CreateOwnerController,
	UpdateOwnerController,
	DeleteOwnerController,
} from './owners.controller';

export const ownersPlugin: WorkerModule = {
	name: 'owners',
	basePath: '/api/v1/owners',
	middleware: [authMiddleware],
	routes: [
		{ method: 'get', path: '/me', handler: GetMeOwnerController },
		{ method: 'get', path: '/', handler: ListOwnersController },
		{ method: 'get', path: '/:id', handler: GetOwnerController },
		{ method: 'post', path: '/', handler: CreateOwnerController },
		{ method: 'put', path: '/:id', handler: UpdateOwnerController },
		{ method: 'delete', path: '/:id', handler: DeleteOwnerController },
	],
};
