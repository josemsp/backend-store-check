import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../../shared/supabase/types';
import { ListOwnersParams, UpdateOwnerFromZod } from './owners.types';

export class OwnersService {
	constructor(private db: SupabaseClient<Database>) {}

	async getAll() {
		const { data, error } = await this.db
			.from('owners')
			.select('*');
		if (error) throw new Error(error.message);
		return data;
	}

	async getOne(id: string) {
		const { data, error } = await this.db
			.from('owners')
			.select('*')
			.eq('id', id)
			.maybeSingle();
		if (error) throw new Error(error.message);
		return data;
	}

	async list(params: ListOwnersParams) {
		const { page, pageSize, search, isActive, sortBy, sortDir } = params;

		const from = (page - 1) * pageSize;
		const to = from + pageSize - 1;

		let query = this.db
			.from('owners')
			.select('*', { count: 'exact' });

		if (search) {
			query = query.or(`name.ilike.%${search}%,business_name.ilike.%${search}%,email.ilike.%${search}%`);
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

	async create(payload: { name: string; email: string; phone?: string | null; business_name: string; logo_url?: string | null }) {
		const { data, error } = await this.db
			.from('owners')
			.insert(payload)
			.select()
			.single();

		if (error) throw new Error(error.message);
		return data;
	}

	async update(id: string, payload: UpdateOwnerFromZod) {
		const { data, error } = await this.db
			.from('owners')
			.update(payload)
			.eq('id', id)
			.select()
			.single();

		if (error) throw new Error(error.message);
		return data;
	}

	async delete(id: string) {
		const { error } = await this.db
			.from('owners')
			.delete()
			.eq('id', id);

		if (error) throw new Error(error.message);
		return true;
	}
}
