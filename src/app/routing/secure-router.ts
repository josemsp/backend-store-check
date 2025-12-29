// import { Hono, MiddlewareHandler, Env } from 'hono';

// /**
//  * Opciones de configuración para el router seguro
//  */
// interface SecureRouterOptions<E extends Env> {
//     /** Middleware de autenticación (requerido) */
//     authMiddleware: MiddlewareHandler<E>;
//     /** Rutas que no requieren autenticación */
//     publicPaths?: string[];
//     /** Middlewares adicionales a aplicar después de auth */
//     additionalMiddlewares?: MiddlewareHandler<E>[];
// }

// /**
//  * Crea un router de Hono con autenticación aplicada automáticamente
//  * 
//  * @template E - Tipo de entorno de Hono (debe extender Env)
//  * @param options - Opciones de configuración del router
//  * @returns Una instancia de Hono con middleware de autenticación
//  * 
//  * @example
//  * ```ts
//  * import { authMiddleware } from '../middlewares/auth.middleware';
//  * 
//  * const secureRouter = createSecureRouter<AppContext>({
//  *   authMiddleware,
//  *   publicPaths: ['/health', '/public'],
//  * });
//  * 
//  * secureRouter.get('/private', (c) => c.json({ data: 'secured' }));
//  * ```
//  */
// export function createSecureRouter<E extends Env = Env>(
//     options: SecureRouterOptions<E>
// ): Hono<E> {
//     const {
//         authMiddleware,
//         publicPaths = [],
//         additionalMiddlewares = [],
//     } = options;

//     const router = new Hono<E>();

//     // Aplicar middleware de autenticación con exclusiones
//     router.use('*', async (c, next) => {
//         const path = new URL(c.req.url).pathname;

//         // Omitir autenticación para rutas públicas
//         if (publicPaths.some(publicPath => path.startsWith(publicPath))) {
//             return next();
//         }

//         return authMiddleware(c, next);
//     });

//     // Aplicar middlewares adicionales
//     additionalMiddlewares.forEach(middleware => {
//         router.use('*', middleware);
//     });

//     return router;
// }

// /**
//  * Crea un router básico sin seguridad (útil para rutas públicas)
//  * 
//  * @template E - Tipo de entorno de Hono (debe extender Env)
//  * @returns Una instancia limpia de Hono
//  */
// export function createPublicRouter<E extends Env = Env>(): Hono<E> {
//     return new Hono<E>();
// }

// /**
//  * Combina múltiples routers en uno solo
//  * 
//  * @template E - Tipo de entorno de Hono (debe extender Env)
//  * @param routers - Array de routers a combinar
//  * @returns Un nuevo router que incluye todos los routers proporcionados
//  * 
//  * @example
//  * ```ts
//  * const publicRouter = createPublicRouter<AppContext>();
//  * const secureRouter = createSecureRouter<AppContext>({ authMiddleware });
//  * 
//  * const app = combineRouters(publicRouter, secureRouter);
//  * ```
//  */
// export function combineRouters<E extends Env = Env>(...routers: Hono<E>[]): Hono<E> {
//     const mainRouter = new Hono<E>();

//     routers.forEach(router => {
//         mainRouter.route('/', router);
//     });

//     return mainRouter;
// }


import { ModulePlugin, RouteDefinition } from './route-builder';
import { authMiddleware } from '../middlewares/auth.middleware';

/**
 * Helper para crear plugins con autenticación por defecto
 */
export function createSecurePlugin(
    name: string,
    basePath: string,
    routes: readonly RouteDefinition[],
    additionalMiddleware: readonly any[] = []
): ModulePlugin {
    return {
        name,
        basePath,
        middleware: [authMiddleware, ...additionalMiddleware],
        routes,
    } as const;
}

/**
 * Helper para crear plugins públicos (sin autenticación)
 */
export function createPublicPlugin(
    name: string,
    basePath: string,
    routes: readonly RouteDefinition[],
    middleware: readonly any[] = []
): ModulePlugin {
    return {
        name,
        basePath,
        middleware,
        routes,
    } as const;
}

