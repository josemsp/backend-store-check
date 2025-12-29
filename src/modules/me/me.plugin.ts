import { createSecurePlugin } from '../../app/routing/secure-router';
import {
    GetMeController,
} from './me.controller';

export const mePlugin = createSecurePlugin('me', '/api/v1', [
    { method: 'get', path: 'me', controller: GetMeController },
]);
