import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../../shared/supabase/types';
import { ListOwnersParams, OwnerInsertInput } from './owners.types';

export class OwnersService {
	constructor(private db: SupabaseClient<Database>) {}

	async getAll() {
		const { data, error } = await this.db.from('owners').select('*');
		if (error) throw new Error(error.message);
		return data;
	}

	async getOne(id: string) {
		const { data, error } = await this.db.from('owners').select('*').eq('id', id).maybeSingle();
		if (error) throw new Error(error.message);
		return data;
	}

	async list(params: ListOwnersParams) {
		const { page, page_size, search, is_active, sort_by, sort_dir } = params;

		const from = (page - 1) * page_size;
		const to = from + page_size - 1;

		let query = this.db.from('owners').select('*', { count: 'exact' });

		if (search) {
			query = query.or(`name.ilike.%${search}%,business_name.ilike.%${search}%,email.ilike.%${search}%`);
		}

		if (is_active !== undefined) {
			query = query.eq('is_active', is_active);
		}

		query = query.order(sort_by, { ascending: sort_dir === 'asc' });
		query = query.range(from, to);

		const { data, error, count } = await query;

		if (error) {
			throw new Error(error.message);
		}

		return {
			data,
			meta: {
				page,
				page_size,
				total: count ?? 0,
				total_pages: Math.ceil((count ?? 0) / page_size),
			},
		};
	}

	async create(payload: OwnerInsertInput) {
		const { data, error } = await this.db.from('owners').insert(payload).select().single();

		if (error) throw new Error(error.message);
		return data;
	}

	async update(id: string, payload: Omit<Partial<OwnerInsertInput>, 'id'>) {
		const { data, error } = await this.db.from('owners').update(payload).eq('id', id).select().single();

		if (error) throw new Error(error.message);
		return data;
	}

	async delete(id: string) {
		const { error } = await this.db.from('owners').delete().eq('id', id);

		if (error) throw new Error(error.message);
		return true;
	}
}
