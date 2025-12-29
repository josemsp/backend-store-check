export interface RouteDefinition {
    readonly method: 'get' | 'post' | 'put' | 'patch' | 'delete';
    readonly path: string;
    readonly controller: any;
}

export interface ModulePlugin {
    readonly name: string;
    readonly basePath: string;
    readonly middleware: readonly any[];
    readonly routes: readonly RouteDefinition[];
}

export class PluginRegistry {
    private constructor(private readonly plugins: readonly ModulePlugin[] = []) { }

    static create(): PluginRegistry {
        return new PluginRegistry([]);
    }

    // Register a plugin without mutating - returns new instance
    register(plugin: ModulePlugin): PluginRegistry {
        return new PluginRegistry([...this.plugins, plugin]);
    }

    // Apply all plugins to openapi
    install(openapi: any): void {
        this.plugins.forEach(plugin => {
            // Clean base path (remove trailing slash)
            const normalizedBasePath = plugin.basePath === '/'
                ? '/'
                : plugin.basePath.endsWith('/')
                    ? plugin.basePath.slice(0, -1)
                    : plugin.basePath;

            // Apply middlewares if exist
            if (plugin.middleware.length > 0) {
                // specific handling for root path to avoid `//*`
                const middlewarePath = normalizedBasePath === '/' ? '/*' : `${normalizedBasePath}/*`;
                openapi.use(middlewarePath, ...plugin.middleware);
            }

            // Register routes
            plugin.routes.forEach(route => {
                const routePath = route.path.startsWith('/') ? route.path : `/${route.path}`;
                const fullPath = normalizedBasePath === '/'
                    ? routePath
                    : `${normalizedBasePath}${routePath}`;

                openapi[route.method](fullPath, route.controller);
            });
        });
    }

    // Utility for debugging
    getRegisteredPlugins(): readonly string[] {
        return this.plugins.map(p => p.name);
    }
}