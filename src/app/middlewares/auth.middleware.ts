import { createAnonClient } from '../../infra/supabase/anon.client';
import { UsersService } from '../../modules/users/users.service';
import { AppContext } from '../../shared/supabase';
import { MiddlewareHandler } from 'hono';

export const authMiddleware: MiddlewareHandler<AppContext> = async (c, next) => {
    const authHeader = c.req.header('Authorization');

    if (!authHeader?.startsWith('Bearer ')) {
        return c.json({ error: "Unauthorized" }, 401);
    }

    const token = authHeader.replace('Bearer ', '');

    try {
        // Supabase client with auth header
        const supabase = createAnonClient(c.env, {
            global: {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        });

        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error || !user) {
            return c.json({ error: 'Invalid token', details: error?.message }, 401);
        }

        const usersService = new UsersService(supabase);
        const profile = await usersService.getOne(user.id);

        c.set('user', user);
        if (profile) {
            c.set('profile', profile);
        }
        c.set('supabase', supabase);

        await next();
    } catch (error) {
        console.error('Auth Error:', error);
        return c.json({ error: "Unauthorized" }, 401);
    }
}

/**
 * Middleware opcional: verifica roles específicos
 * Usar después de authMiddleware
 */
export const requireRole = (allowedRoles: string[]): MiddlewareHandler<AppContext> => {
    return async (c, next) => {
        const user = c.get('user');

        if (!user) {
            return c.json({ error: 'Unauthorizedrrr' }, 401);
        }

        const userRole = user.user_metadata?.role || user.app_metadata?.role;

        if (!allowedRoles.includes(userRole)) {
            return c.json({ error: 'Insufficient permissions' }, 403);
        }

        await next();
    };
};

/**
 * Middleware opcional: verifica que el usuario haya verificado su email
 */
export const requireEmailVerified: MiddlewareHandler<AppContext> = async (c, next) => {
    const user = c.get('user');

    if (!user?.email_confirmed_at) {
        return c.json({ error: 'Email not verified' }, 403);
    }

    await next();
};
