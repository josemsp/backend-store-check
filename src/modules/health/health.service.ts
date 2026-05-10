import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../../shared/supabase/types';

export class HealthService {
	constructor(private db: SupabaseClient<Database>) {}

	async checkDatabase(): Promise<{ status: string; service: string; latency: string }> {
		const start = performance.now();

		const { error } = await this.db.from('healthcheck').select('id').single();

		const latency = `${Math.round(performance.now() - start)}ms`;

		if (error) {
			return {
				status: 'error',
				service: 'database',
				latency,
			};
		}

		return {
			status: 'ok',
			service: 'database',
			latency,
		};
	}
}
