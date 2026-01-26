import { Handler, MiddlewareHandler } from 'hono';
import { OpenAPIRoute } from 'chanfana';

export type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

export interface Route {
    readonly method: HttpMethod;
    readonly path: string;
    readonly handler: RouteHandler;
}

export interface WorkerModule {
    readonly name: string;
    readonly basePath: string;
    readonly middleware?: readonly MiddlewareHandler[];
    readonly routes: readonly Route[];
}

export interface ModuleInfo {
    readonly name: string;
    readonly basePath: string;
    readonly routeCount: number;
    readonly middlewareCount: number;
}

export type RouteHandler = Handler | typeof OpenAPIRoute;

interface HonoInstance {
    use(path: string, ...handlers: MiddlewareHandler[]): void;
    get(path: string, handler: RouteHandler): void;
    post(path: string, handler: RouteHandler): void;
    put(path: string, handler: RouteHandler): void;
    patch(path: string, handler: RouteHandler): void;
    delete(path: string, handler: RouteHandler): void;
}

export class WorkerModuleRegistry {
    private constructor(
        private readonly modules: ReadonlyMap<string, WorkerModule> = new Map()
    ) { }

    static create(): WorkerModuleRegistry {
        return new WorkerModuleRegistry(new Map());
    }

    /**
     * Register a new worker module. Throws if module name already exists.
     */
    registerModule(module: WorkerModule): WorkerModuleRegistry {
        this.validateModule(module);

        if (this.modules.has(module.name)) {
            throw new Error(`Worker module "${module.name}" is already registered`);
        }

        const newModules = new Map(this.modules);
        newModules.set(module.name, module);

        return new WorkerModuleRegistry(newModules);
    }

    /**
     * Register multiple worker modules at once
     */
    registerModules(modules: readonly WorkerModule[]): WorkerModuleRegistry {
        return modules.reduce(
            (registry, module) => registry.registerModule(module),
            this as WorkerModuleRegistry
        );
    }

    /**
     * Unregister a worker module by name
     */
    unregisterModule(moduleName: string): WorkerModuleRegistry {
        const newModules = new Map(this.modules);
        newModules.delete(moduleName);
        return new WorkerModuleRegistry(newModules);
    }

    /**
     * Check if a worker module is registered
     */
    hasModule(moduleName: string): boolean {
        return this.modules.has(moduleName);
    }

    /**
     * Get worker module by name
     */
    getModule(moduleName: string): WorkerModule | undefined {
        return this.modules.get(moduleName);
    }

    /**
     * Apply all worker modules to Hono instance (with Chanfana)
     */
    applyToHono(hono: HonoInstance): void {
        this.modules.forEach(module => {
            this.applyModule(hono, module);
        });
    }

    /**
     * Get detailed information about all registered modules
     */
    getModulesInfo(): readonly ModuleInfo[] {
        return Array.from(this.modules.values()).map(module => ({
            name: module.name,
            basePath: module.basePath,
            routeCount: module.routes.length,
            middlewareCount: module.middleware?.length ?? 0
        }));
    }

    /**
     * Get list of registered module names
     */
    getModuleNames(): readonly string[] {
        return Array.from(this.modules.keys());
    }

    /**
     * Get total number of registered modules
     */
    get moduleCount(): number {
        return this.modules.size;
    }

    /**
     * Get total number of routes across all modules
     */
    get totalRoutes(): number {
        return Array.from(this.modules.values())
            .reduce((sum, module) => sum + module.routes.length, 0);
    }

    private validateModule(module: WorkerModule): void {
        if (!module.name?.trim()) {
            throw new Error('Worker module name cannot be empty');
        }

        if (!module.basePath) {
            throw new Error(`Worker module "${module.name}" must have a basePath`);
        }

        if (!Array.isArray(module.routes)) {
            throw new Error(`Worker module "${module.name}" routes must be an array`);
        }

        module.routes.forEach((route, index) => {
            if (!route.method || !route.path || !route.handler) {
                throw new Error(
                    `Invalid route at index ${index} in worker module "${module.name}"`
                );
            }
        });
    }

    private applyModule(hono: HonoInstance, module: WorkerModule): void {
        const normalizedBasePath = this.normalizePath(module.basePath);

        // Apply middleware if exists
        const middleware = module.middleware ?? [];
        if (middleware.length > 0) {
            const middlewarePath = this.buildMiddlewarePath(normalizedBasePath);
            hono.use(middlewarePath, ...middleware);
        }

        // Register routes
        module.routes.forEach(route => {
            const fullPath = this.buildRoutePath(normalizedBasePath, route.path);
            hono[route.method](fullPath, route.handler);
        });
    }

    private normalizePath(path: string): string {
        if (path === '/') return '/';

        // Remove trailing slash
        const normalized = path.endsWith('/') ? path.slice(0, -1) : path;

        // Ensure leading slash
        return normalized.startsWith('/') ? normalized : `/${normalized}`;
    }

    private buildMiddlewarePath(basePath: string): string {
        return basePath === '/' ? '/*' : `${basePath}/*`;
    }

    private buildRoutePath(basePath: string, routePath: string): string {
        // Ensure route path starts with /
        const normalizedRoute = routePath.startsWith('/')
            ? routePath
            : `/${routePath}`;

        // Combine paths
        let fullPath = basePath === '/'
            ? normalizedRoute
            : `${basePath}${normalizedRoute}`;

        // Remove trailing slash if not root
        if (fullPath !== '/' && fullPath.endsWith('/')) {
            fullPath = fullPath.slice(0, -1);
        }

        return fullPath;
    }
}
