import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../../shared/supabase/types";
import { UserAPISchema } from "./users.schemas";
import { ListProfilesParams, UpdateUserFromZod } from "./users.types";

export class UsersService {
    constructor(private db: SupabaseClient<Database>) { }

    async getMe() {
        const { data: profile, error } = await this.db
            .schema('core')
            .from('v_my_profile')
            .select('*')
            .maybeSingle();

        if (error) throw new Error(error.message);

        try {
            return UserAPISchema.parse(profile);
        } catch (error) {
            console.error('Profile validation error:', error);
            throw new Error('Invalid profile data from database');
        }
    }

    // async listProfiles(params: ListUserProfilesQuery): Promise<PaginatedUserProfiles> {
    //     const { page, limit, sort_by, sort_order, ...filters } = params;
    //     const offset = (page - 1) * limit;

    //     let query = this.supabase
    //         .from('v_user_profiles_full')
    //         .select('*', { count: 'exact' });

    //     // Aplicar filtros
    //     if (filters.status) {
    //         query = query.eq('status', filters.status);
    //     }

    //     if (filters.company_id) {
    //         query = query.eq('company_id', filters.company_id);
    //     }

    //     if (filters.is_root !== undefined) {
    //         query = query.eq('is_root', filters.is_root);
    //     }

    //     if (filters.search) {
    //         query = query.or(
    //             `email.ilike.%${filters.search}%,full_name.ilike.%${filters.search}%`
    //         );
    //     }

    //     if (filters.role_name) {
    //         query = query.contains('roles', [{ name: filters.role_name }]);
    //     }

    //     if (filters.permission_key) {
    //         query = query.contains('permissions', [filters.permission_key]);
    //     }

    //     query = query.order(sort_by, { ascending: sort_order === 'asc' });
    //     query = query.range(offset, offset + limit - 1);

    //     const { data, error, count } = await query;

    //     if (error) {
    //         throw new AppError(500, `Database error: ${error.message}`);
    //     }

    //     const total = count || 0;
    //     const total_pages = Math.ceil(total / limit);

    //     return {
    //         data: data || [],
    //         pagination: {
    //             page,
    //             limit,
    //             total,
    //             total_pages,
    //             has_next: page < total_pages,
    //             has_prev: page > 1,
    //         },
    //     };
    // }

    async getAll() {
        const { data, error } = await this.db.schema('core')
            .from('profiles')
            .select('id, company_id, role_id, email, first_name, last_name, full_name, avatar_url, status, created_at, updated_at');
        if (error) throw new Error(error.message);

        return data;
    }

    async getOne(id: string) {
        const { data, error } = await this.db.schema('core')
            .from('profiles')
            .select('id, company_id, role_id, email, first_name, last_name, full_name, avatar_url, status, created_at, updated_at')
            .eq('id', id)
            .single();

        if (error) throw new Error(error.message);

        return data;
    }

    async listProfiles(params: ListProfilesParams) {
        const {
            page,
            pageSize,
            search,
            status,
            fromDate,
            toDate,
            sortBy,
            sortDir,
        } = params;

        const from = (page - 1) * pageSize;
        const to = from + pageSize - 1;

        let query = this.db
            .schema("core")
            .from("profiles")
            .select(`
                id,
                email,
                first_name,
                last_name,
                full_name,
                avatar_url,
                status,
                created_at,
                updated_at,
                role:roles (
                    id,
                    name
                )
                `,
                { count: "exact" }
            );

        // 🔍 búsqueda por texto
        if (search) {
            query = query.or(
                `first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%`
            );
        }

        // 🏷 filtro por estatus
        if (status) {
            query = query.eq("status", status);
        }

        // 📅 filtro por fecha
        if (fromDate) {
            query = query.gte("created_at", `${fromDate}T00:00:00`);
        }

        if (toDate) {
            query = query.lte("created_at", `${toDate}T23:59:59`);
        }

        // ↕️ orden
        query = query.order(sortBy, { ascending: sortDir === "asc" });

        // 📄 paginación
        query = query.range(from, to);

        const { data, error, count } = await query;

        if (error) {
            throw new Error(error.message);
        }

        return {
            data,
            meta: {
                page,
                pageSize,
                total: count ?? 0,
                totalPages: Math.ceil((count ?? 0) / pageSize),
            },
        };
    }

    async isUserInvited(email: string) {
        const { data, error } = await this.db.schema("core").from("invitations").select("id").eq("email", email).single();
        if (error) throw new Error(error.message);
        return data;
    }

    async update(id: string, payload: UpdateUserFromZod) {
        const { error } = await this.db
            .schema('core')
            .from('profiles')
            .update(payload)
            .eq('id', id)
            .neq('status', 'deleted');
        if (error) throw new Error(error.message);

        return true;
    }

    async delete(id: string) {
        const { error } = await this.db
            .schema('core')
            .from('profiles')
            .update({ status: 'deleted', deleted_at: new Date().toISOString() })
            .eq('id', id);
        if (error) throw new Error(error.message);

        return true;
    }
}