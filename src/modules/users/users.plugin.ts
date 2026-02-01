import { authMiddleware } from '../../app/middlewares/auth.middleware';
import { WorkerModule } from '../../app/routing/worker.module.registry';
import {
    ListUsersController,
    GetUserController,
    GetMeController,
} from './users.controller';

export const usersPlugin: WorkerModule = {
    name: 'users',
    basePath: '/api/v1/users',
    middleware: [authMiddleware],
    routes: [
        { method: 'get', path: '/me', handler: GetMeController },
        // { method: 'get', path: '/', handler: ListUsersController },
        { method: 'get', path: '/:id', handler: GetUserController }
        // { method: 'post', path: '/', controller: CreateUserController },
    ]
};
