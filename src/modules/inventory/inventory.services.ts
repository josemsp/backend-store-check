import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../../shared/supabase/types';
import { ListInventoryParams, UpdateInventoryFromZod } from './inventory.types';

export class InventoryService {
	constructor(private db: SupabaseClient<Database>) {}

	async getAll() {
		const { data, error } = await this.db
			.from('inventory')
			.select('*');
		if (error) throw new Error(error.message);
		return data;
	}

	async getOne(id: string) {
		const { data, error } = await this.db
			.from('inventory')
			.select('*')
			.eq('id', id)
			.maybeSingle();
		if (error) throw new Error(error.message);
		return data;
	}

	async list(params: ListInventoryParams) {
		const { page, pageSize, search, ownerId, branchId, productId, sortBy, sortDir } = params;

		const from = (page - 1) * pageSize;
		const to = from + pageSize - 1;

		let query = this.db
			.from('inventory')
			.select('*', { count: 'exact' });

		if (ownerId) {
			query = query.eq('owner_id', ownerId);
		}

		if (branchId) {
			query = query.eq('branch_id', branchId);
		}

		if (productId) {
			query = query.eq('product_id', productId);
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

	async create(payload: { owner_id: string; branch_id: string; product_id: string; quantity?: number }) {
		const { data, error } = await this.db
			.from('inventory')
			.insert(payload)
			.select()
			.single();

		if (error) throw new Error(error.message);
		return data;
	}

	async update(id: string, payload: UpdateInventoryFromZod) {
		const { data, error } = await this.db
			.from('inventory')
			.update(payload)
			.eq('id', id)
			.select()
			.single();

		if (error) throw new Error(error.message);
		return data;
	}

	async delete(id: string) {
		const { error } = await this.db
			.from('inventory')
			.delete()
			.eq('id', id);

		if (error) throw new Error(error.message);
		return true;
	}
}
