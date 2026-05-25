import { Context } from 'hono';
import { z } from 'zod';
import { HealthService } from './health.service';
import { AppContext } from '../../shared/supabase/general';
import { BaseController } from '../../shared/utils/base.controller';
import { successResponse } from '../../shared/utils/response';
import { createAdminClient } from '../../infra/supabase/admin.client';

const HealthCheckAPISchema = z.object({
	database: z.object({
		status: z.string(),
		latency: z.string(),
	}),
});

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
		const supabase = createAdminClient(c.env);
		const service = new HealthService(supabase);

		const dbStatus = await service.checkDatabase();

		return successResponse(c, { database: dbStatus });
	}
}
