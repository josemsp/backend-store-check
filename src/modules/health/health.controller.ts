import { contentJson, OpenAPIRoute, OpenAPIRouteSchema } from 'chanfana';
import { Context } from 'hono';
import { z } from 'zod';
import { HealthService } from './health.service';
import { AppContext } from '../../shared/supabase';
import { createAnonClient } from '../../infra/supabase/anon.client';

export class HealthCheckController extends OpenAPIRoute {
    schema: OpenAPIRouteSchema = {
        tags: ['System'],
        summary: 'Check API and Database health',
        responses: {
            '200': {
                description: 'System is healthy',
                ...contentJson(
                    z.object({
                        uptime: z.string(),
                        database: z.object({
                            status: z.string(),
                            latency: z.string(),
                        }),
                    })
                )
            },
            '503': {
                description: 'Service Unavailable',
            },
        },
    };

    async handle(c: Context<AppContext>) {
        const service = new HealthService(createAnonClient(c.env));

        try {
            const dbStatus = await service.checkDatabase();

            return c.json({ database: dbStatus, }, 200);
        } catch (error: any) {
            return c.json({
                status: 'error',
                message: error.message,
            }, 503);
        }
    }
}