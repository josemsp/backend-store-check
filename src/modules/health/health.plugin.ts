import { createPublicPlugin } from "../../app/routing/secure-router";
import { HealthCheckController } from "./health.controller";

export const healthPlugin = createPublicPlugin('health', '/', [
    {
        method: 'get',
        path: 'health',
        controller: HealthCheckController,
    },
]);