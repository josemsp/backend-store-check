import { SupabaseClient } from "@supabase/supabase-js";
import { CreateCompanyFromZod, ListCompaniesParams, UpdateCompanyFromZod } from "./companies.validators";

export class CompaniesService {
    constructor(private db: SupabaseClient) { }

    async getAll() {
        const { data, error } = await this.db.schema('core')
            .from('companies')
            .select('*');
        if (error) throw new Error(error.message);

        return data;
    }

    async getOne(id: string) {
        const { data, error } = await this.db.schema('core')
            .from('companies')
            .select('*')
            .eq('id', id)
            .single();
        if (error) throw new Error(error.message);

        return data;
    }

    async list(params: ListCompaniesParams) {
        const {
            page,
            pageSize,
            search,
            sortBy,
            sortDir,
        } = params;

        const from = (page - 1) * pageSize;
        const to = from + pageSize - 1;

        let query = this.db
            .schema("core")
            .from("companies")
            .select('*', { count: "exact" });

        // search by name
        if (search) {
            query = query.ilike('name', `%${search}%`);
        }

        // order
        query = query.order(sortBy, { ascending: sortDir === "asc" });

        // pagination
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

    async create(payload: CreateCompanyFromZod) {
        const { data, error } = await this.db
            .schema('core')
            .from('companies')
            .insert(payload)
            .select()
            .single();

        if (error) throw new Error(error.message);

        return data;
    }

    async update(id: string, payload: UpdateCompanyFromZod) {
        const { data, error } = await this.db
            .schema('core')
            .from('companies')
            .update(payload)
            .eq('id', id)
            .select()
            .single();

        if (error) throw new Error(error.message);

        return data;
    }

    async delete(id: string) {
        const { error } = await this.db
            .schema('core')
            .from('companies')
            .delete()
            .eq('id', id);

        if (error) throw new Error(error.message);

        return true;
    }
}
