import { SupabaseClient } from '@supabase/supabase-js';

export class HealthService {
    constructor(private db: SupabaseClient) { }

    async checkDatabase(): Promise<{ status: string; service: string; timestamp: string }> {
        const timestamp = new Date().toISOString();

        return {
            status: 'ok',
            service: 'database',
            timestamp,
        };
    }
}
