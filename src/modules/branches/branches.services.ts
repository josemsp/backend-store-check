import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../../shared/supabase/types';
import { CreateBranchDB, ListBranchesParams, UpdateBranchFromZod } from './branches.types';

export class BranchesService {
	constructor(private db: SupabaseClient<Database>) {}

	async getAll() {
		const { data, error } = await this.db.from('branches').select('*');
		if (error) throw new Error(error.message);
		return data;
	}

	async getOne(id: string) {
		const { data, error } = await this.db.from('branches').select('*').eq('id', id).maybeSingle();
		if (error) throw new Error(error.message);
		return data;
	}

	async list(params: ListBranchesParams) {
		const { page, pageSize, search, ownerId, type, isActive, sortBy, sortDir } = params;

		const from = (page - 1) * pageSize;
		const to = from + pageSize - 1;

		let query = this.db.from('branches').select('*', { count: 'exact' });

		if (search) {
			query = query.or(`name.ilike.%${search}%,address.ilike.%${search}%,phone.ilike.%${search}%`);
		}

		if (ownerId) {
			query = query.eq('owner_id', ownerId);
		}

		if (type) {
			query = query.eq('type', type);
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

	async create(payload: CreateBranchDB) {
		const { data, error } = await this.db.from('branches').insert(payload).select().single();

		if (error) throw new Error(error.message);
		return data;
	}

	async update(id: string, payload: UpdateBranchFromZod) {
		const { data, error } = await this.db.from('branches').update(payload).eq('id', id).select().single();

		if (error) throw new Error(error.message);
		return data;
	}

	async delete(id: string) {
		const { error } = await this.db.from('branches').delete().eq('id', id);

		if (error) throw new Error(error.message);
		return true;
	}
}
