import { createSecurePlugin } from '../../app/routing/secure-router';
import {
    ListUsersController,
    CreateUserController,
    GetUserController,
} from './users.controller';

export const usersPlugin = createSecurePlugin('users', '/api/v1', [
    { method: 'get', path: 'users', controller: ListUsersController },
    { method: 'get', path: 'users/:id', controller: GetUserController },
    { method: 'post', path: 'users', controller: CreateUserController },
]);
