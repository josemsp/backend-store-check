import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../../shared/supabase/types';
import { CreateProductFromZod, ListProductsSchema } from './products.validators';
import { z } from 'zod';

export class ProductsService {
    constructor(private db: SupabaseClient<Database>) { }

    async getAll() {
        const { data, error } = await this.db.from('products').select('*');
        if (error) throw new Error(error.message);
        return data;
    }

    async getOne(id: string) {
        const { data, error } = await this.db.from('products').select('*').eq('id', id).maybeSingle();
        if (error) throw new Error(error.message);
        return data;
    }

    async list(params: z.infer<typeof ListProductsSchema>) {
        const { page, pageSize, search, categoryId, isActive, sortBy, sortDir } = params;

        const from = (page - 1) * pageSize;
        const to = from + pageSize - 1;

        let query = this.db
            .from('products')
            .select('*', { count: 'exact' });

        if (search) {
            query = query.or(`name.ilike.%${search}%,sku.ilike.%${search}%`);
        }

        if (categoryId) {
            query = query.eq('category_id', categoryId);
        }

        if (isActive !== undefined) {
            query = query.eq('is_active', isActive);
        }

        query = query.order(sortBy, { ascending: sortDir === 'asc' });
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

    async create(payload: CreateProductFromZod) {
        const { data, error } = await this.db
            .from('products')
            .insert(payload)
            .select()
            .single();
        if (error) throw new Error(error.message);
        return data;
    }

    async update(id: string, payload: Partial<CreateProductFromZod>) {
        const { data, error } = await this.db
            .from('products')
            .update(payload)
            .eq('id', id)
            .select()
            .single();
        if (error) throw new Error(error.message);
        return data;
    }

    async delete(id: string) {
        const { error } = await this.db
            .from('products')
            .delete()
            .eq('id', id);
        if (error) throw new Error(error.message);
        return true;
    }
}
