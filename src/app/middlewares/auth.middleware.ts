import { createAnonClient } from '../../infra/supabase/anon.client';
import { UserService } from '../../modules/users/users.services';
import { CurrentUserProfileDB } from '../../modules/users/users.types';
import { MiddlewareHandler } from 'hono';
import { unauthorizedError } from '../../shared/utils/response';
import { AppContext } from '../../shared/supabase/general';
import { extractBearerToken } from '../../shared/supabase/helpers';

export const authMiddleware: MiddlewareHandler<AppContext> = async (c, next) => {
	const token = extractBearerToken(c.req.header('Authorization'));

	if (!token) {
		return unauthorizedError(c);
	}

	const supabase = createAnonClient(c.env, {
		global: {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		},
	});

	const {
		data: { user: authUser },
		error: authError,
	} = await supabase.auth.getUser(token);

	if (authError || !authUser) {
		return unauthorizedError(c);
	}

	try {
		const service = new UserService(supabase);
		let profile: CurrentUserProfileDB | undefined = undefined;
		try {
			profile = await service.getMe();
		} catch (error) {
			console.warn('No se pudo cargar el perfil del usuario:', error);
		}

		c.set('supabase', supabase);
		c.set('profile', profile);

		await next();
	} catch (error) {
		console.error('Error inesperado en auth middleware:', error);
		return c.json({ error: 'Error interno de autenticación' }, 500);
	}
};
