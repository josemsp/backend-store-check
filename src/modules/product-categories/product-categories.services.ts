import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../../shared/supabase/types';
import { ListProductCategoriesParams, UpdateProductCategoryFromZod } from './product-categories.types';

export class ProductCategoriesService {
	constructor(private db: SupabaseClient<Database>) {}

	async getAll() {
		const { data, error } = await this.db
			.from('product_categories')
			.select('*');
		if (error) throw new Error(error.message);
		return data;
	}

	async getOne(id: string) {
		const { data, error } = await this.db
			.from('product_categories')
			.select('*')
			.eq('id', id)
			.maybeSingle();
		if (error) throw new Error(error.message);
		return data;
	}

	async list(params: ListProductCategoriesParams) {
		const { page, pageSize, search, ownerId, isActive, isSystem, sortBy, sortDir } = params;

		const from = (page - 1) * pageSize;
		const to = from + pageSize - 1;

		let query = this.db
			.from('product_categories')
			.select('*', { count: 'exact' });

		if (search) {
			query = query.ilike('name', `%${search}%`);
		}

		if (ownerId) {
			query = query.eq('owner_id', ownerId);
		}

		if (isActive !== undefined) {
			query = query.eq('is_active', isActive);
		}

		if (isSystem !== undefined) {
			query = query.eq('is_system', isSystem);
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

	async create(payload: { owner_id: string | null; name: string; description?: string | null }) {
		const { data, error } = await this.db
			.from('product_categories')
			.insert(payload)
			.select()
			.single();

		if (error) throw new Error(error.message);
		return data;
	}

	async update(id: string, payload: UpdateProductCategoryFromZod) {
		const { data, error } = await this.db
			.from('product_categories')
			.update(payload)
			.eq('id', id)
			.select()
			.single();

		if (error) throw new Error(error.message);
		return data;
	}

	async delete(id: string) {
		const { error } = await this.db
			.from('product_categories')
			.delete()
			.eq('id', id);

		if (error) throw new Error(error.message);
		return true;
	}
}
