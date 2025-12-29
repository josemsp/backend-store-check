import { SupabaseClient } from '@supabase/supabase-js';
import { CreateProductFromZod } from './products.validators';

export class ProductsService {
    constructor(private db: SupabaseClient) { }

    async getAll() {
        const { data, error } = await this.db.schema('inventory').from('products').select('*');
        if (error) throw new Error(error.message);
        return data;
    }

    async create(payload: CreateProductFromZod) {
        const { data, error } = await this.db
            .schema('inventory')
            .from('products')
            .insert(payload)
            .select()
            .single();
        if (error) throw new Error(error.message);
        return data;
    }
}