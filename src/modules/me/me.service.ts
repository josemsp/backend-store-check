import { SupabaseClient } from "@supabase/supabase-js";

export class MeService {
    constructor(private db: SupabaseClient) { }

    async getMe(id: string) {
        const { data, error } = await this.db.schema('core')
            .from('profiles')
            .select('id, company_id, role_id, email, first_name, last_name, full_name, avatar_url, status, created_at, updated_at')
            .eq('id', id)
            .maybeSingle();

        if (error) throw new Error(error.message);

        return data;
    }
}