import { createAnonClient } from '../../infra/supabase/anon.client';
import { UsersService } from '../../modules/users/users.services';
import { UserAPI } from '../../modules/users/users.types';
import { MiddlewareHandler } from 'hono';
import { unauthorizedError } from '../../shared/utils/response';
import { AppContext } from '../../shared/supabase/general';
import { extractBearerToken } from '../../shared/supabase/helpers';

/**
 * Middleware for authentication optimized for Cloudflare Workers
 * - Avoids unnecessary expensive operations
 * - Minimizes Supabase calls
 * - Cache-aware for better performance
 */
export const authMiddleware: MiddlewareHandler<AppContext> = async (c, next) => {
    const token = extractBearerToken(c.req.header('Authorization'));

    if (!token) {
        return unauthorizedError(c);
    }

    // Supabase client with token
    const supabase = createAnonClient(c.env, {
        global: {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
    });
    // Validate token and get user (single request)
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !authUser) {
        return unauthorizedError(c);
    }

    try {

        const service = new UsersService(supabase);
        // Intentar obtener el perfil, pero no detener el request si falla
        let profile: UserAPI | undefined = undefined;
        try {
            profile = await service.getMe();
        } catch (error) {
            console.warn('No se pudo cargar el perfil del usuario:', error);
            // No retornamos error fatal, permitimos continuar
            // Los middlewares posteriores (requirePermission, etc) validarán si el perfil es necesario
        }

        c.set('supabase', supabase);
        c.set('profile', profile);

        await next();
    } catch (error) {
        console.error('Error inesperado en auth middleware:', error);
        return c.json({ error: 'Error interno de autenticación' }, 500);
    }
};

export const requirePermission = (...permissions: string[]): MiddlewareHandler<AppContext> => {
    return async (c, next) => {
        const user = c.get('profile');
        if (!user) {
            return unauthorizedError(c);
        }

        // Verificar que tenga TODOS los permisos requeridos
        const hasAllPermissions = permissions.every((perm) =>
            user.permissions.includes(perm)
        );

        if (!hasAllPermissions) {
            console.log('Permisos insuficientes', permissions, user.permissions);
            return unauthorizedError(c);
        }

        await next();
    };
};

export const requireAnyPermission = (...permissions: string[]): MiddlewareHandler<AppContext> => {
    return async (c, next) => {
        const user = c.get('profile');
        if (!user) {
            return unauthorizedError(c);
        }

        const hasAnyPermission = permissions.some((perm) =>
            user.permissions.includes(perm)
        );

        if (!hasAnyPermission) {
            console.log('Permisos insuficientes', permissions, user.permissions);
            return unauthorizedError(c);
        }

        await next();
    };
};

export const requireRole = (...roleNames: string[]): MiddlewareHandler<AppContext> => {
    return async (c, next) => {
        const user = c.get('profile');
        if (!user) {
            return unauthorizedError(c);
        }

        const hasRole = user.roles.some((role) => roleNames.includes(role.name));

        if (!hasRole) {
            console.log('Roles insuficientes', roleNames, user.roles);
            return unauthorizedError(c);
        }

        await next();
    };
};

export const requireAdmin: MiddlewareHandler<AppContext> = async (c, next) => {
    const user = c.get('profile');

    if (!user) {
        return unauthorizedError(c);
    }

    if (!user.isRoot) {
        console.log('No es root', user);
        return unauthorizedError(c);
    }

    await next();
};

export const requireRoot: MiddlewareHandler<AppContext> = async (c, next) => {
    const user = c.get('profile');

    if (!user) {
        return unauthorizedError(c);
    }

    if (!user.isRoot) {
        console.log('No es root', user);
        return unauthorizedError(c);
    }

    await next();
};

// export const requireOwnership = (
//     resourceType: Database['core']['Tables'] | Database['core']['Views'],
//     resourceIdParam: string = 'id',
//     allowedPermission?: string
// ): MiddlewareHandler<AppContext> => {
//     return async (c, next) => {
//         const user = c.get('profile');
//         const supabase = c.get('supabase');
//         const resourceId = c.req.param(resourceIdParam);

//         if (!resourceId) {
//             console.log('No se proporciono el id del recurso');
//             return forbiddenError(c);
//         }

//         // Verificar propiedad
//         // const table: = resourceType;
        
//         const { data: resource } = await supabase
//             .from(resourceType)
//             .select('user_id, company_id')
//             .eq('id', resourceId)
//             .single();

//         if (!resource) {
//             return c.json({ error: 'Recurso no encontrado' }, 404);
//         }

//         const isOwner = resource.user_id === user.id;
//         const sameCompany = resource.company_id === user.companyId;
//         const hasPermission = allowedPermission
//             ? user.permissions.includes(allowedPermission)
//             : false;

//         // Permitir si es dueño, o si tiene el permiso Y es de la misma compañía
//         if (!isOwner && !(hasPermission && sameCompany)) {
//             return c.json(
//                 { error: 'No tienes acceso a este recurso' },
//                 403
//             );
//         }

//         // Guardar el recurso en el contexto para no consultarlo de nuevo
//         c.set('resource' as any, resource);

//         await next();
//     };
// };
