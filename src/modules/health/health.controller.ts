import { Context } from 'hono';
import { z } from 'zod';
import { HealthService } from './health.service';
import { AppContext } from '../../shared/supabase/general';
import { BaseController } from '../../shared/utils/base.controller';
import { serverError, successResponse } from '../../shared/utils/response';

const HealthCheckAPISchema = z.object({
    database: z.object({
        status: z.string(),
        latency: z.string(),
    })
})

export class HealthCheckController extends BaseController {
    schema = {
        tags: ['System'],
        summary: 'Check API and Database health',
        responses: this.createStandardResponses(HealthCheckAPISchema, {
            successDescription: 'System is healthy',
            include400: true,
            include404: true,
        }),
    };

    async handle(c: Context<AppContext>) {
        const service = new HealthService(c.get('supabase'));

        try {
            const dbStatus = await service.checkDatabase();

            return successResponse(c, { database: dbStatus, });
        } catch (error: any) {
            return serverError(c, error);
        }
    }
}