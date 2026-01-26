import { WorkerModule } from "../../app/routing/worker.module.registry";
import { HealthCheckController } from "./health.controller";

export const healthPlugin: WorkerModule = {
    name: 'health',
    basePath: '/api/v1/health',
    routes: [
        { method: 'get', path: '/', handler: HealthCheckController }
    ]
};
