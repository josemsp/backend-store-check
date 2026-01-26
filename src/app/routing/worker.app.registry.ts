import { Hono } from "hono";
import { AppContext } from "../../shared/supabase/general";
import { WorkerModule, WorkerModuleRegistry } from "./worker.module.registry";
import { errorMiddleware } from "../middlewares/error.middleware";
import { fromHono, OpenAPIRoute } from "chanfana";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import { openApiConfig } from "../config/openapi.config";
import { corsConfig } from "../config/cors.config";

export function createWorkerApp(modules: WorkerModule[]) {
    // 1. Initialize Hono
    const app = new Hono<AppContext>();

    // 2. Global middleware
    setupGlobalMiddleware(app);

    // 3. Error handling
    app.onError(errorMiddleware);

    // 4. Initialize OpenAPI (wraps Hono)
    const openapi = fromHono(app, openApiConfig);

    // 5. Register security schemes
    registerSecuritySchemes(openapi);

    // 6. Register and apply modules
    const registry = WorkerModuleRegistry
        .create()
        .registerModules(modules);

    registry.applyToHono(openapi);

    // 7. Log module statistics
    logModuleStats(registry);

    // 8. 404 handler
    app.notFound((c) => c.json({ message: 'Route not found' }, 404));

    return app;
}

function setupGlobalMiddleware(app: Hono<AppContext>) {
    // Logger
    app.use('*', logger());

    // CORS
    app.use('*', cors(corsConfig));
}

function registerSecuritySchemes(openapi: any) {
    openapi.registry.registerComponent('securitySchemes', 'BearerAuth', {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT token from Supabase Auth. Format: Bearer {token}'
    });
}

function logModuleStats(registry: WorkerModuleRegistry) {
    console.log('\n🚀 Worker Application Started');
    console.log(`📦 Modules loaded: ${registry.moduleCount}`);
    console.log(`🛣️  Total routes: ${registry.totalRoutes}`);
    console.log('\n📋 Registered modules:');

    registry.getModulesInfo().forEach(module => {
        console.log(`   • ${module.name}: ${module.routeCount} routes at ${module.basePath}`);
    });
    console.log('');
}
