import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../../shared/supabase/types";

export class RolesService {

    constructor(private db: SupabaseClient<Database>) { }

    async getRoleById(id: string) {
        const { data, error } = await this.db.schema('core')
            .from('roles')
            .select(`
                id,
                name,
                is_system_role,
                description,
                created_at,
                updated_at
            `)
            .eq('id', id)
            .maybeSingle();

        if (error) throw new Error(error.message);

        return data;
    }

    async getRoleByName(name: string) {
        const { data, error } = await this.db.schema('core')
            .from('roles')
            .select(`
                id,
                name,
                is_system_role,
                description,
                created_at,
                updated_at
            `)
            .eq('name', name)
            .maybeSingle();

        if (error) throw new Error(error.message);

        return data;
    }

    async getAllRoles() {
        let query = this.db.schema('core')
            .from('roles')
            .select(`
                id,
                name,
                is_system_role,
                description,
                created_at,
                updated_at
            `);

        const { data, error } = await query;

        if (error) throw new Error(error.message);

        return data;
    }

}