import { authMiddleware } from '../../app/middlewares/auth.middleware';
import { WorkerModule } from '../../app/routing/worker.module.registry';
import { GetUserController, GetMeController, UpdateUserController } from './users.controller';

export const usersPlugin: WorkerModule = {
	name: 'users',
	basePath: '/api/v1/users',
	middleware: [authMiddleware],
	routes: [
		{ method: 'get', path: '/me', handler: GetMeController },
		{ method: 'get', path: '/:id', handler: GetUserController },
		{ method: 'put', path: '/:id', handler: UpdateUserController },
	],
};
