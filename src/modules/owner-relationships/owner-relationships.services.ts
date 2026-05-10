import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../../shared/supabase/types';
import { ListOwnerRelationshipsParams, UpdateOwnerRelationshipFromZod, CreateOwnerRelationshipDB } from './owner-relationships.types';

export class OwnerRelationshipsService {
	constructor(private db: SupabaseClient<Database>) {}

	async getAll() {
		const { data, error } = await this.db
			.from('owner_relationships')
			.select('*');
		if (error) throw new Error(error.message);
		return data;
	}

	async getOne(id: string) {
		const { data, error } = await this.db
			.from('owner_relationships')
			.select('*')
			.eq('id', id)
			.maybeSingle();
		if (error) throw new Error(error.message);
		return data;
	}

	async list(params: ListOwnerRelationshipsParams) {
		const { page, pageSize, requesterId, targetId, status, sortBy, sortDir } = params;

		const from = (page - 1) * pageSize;
		const to = from + pageSize - 1;

		let query = this.db
			.from('owner_relationships')
			.select('*', { count: 'exact' });

		if (requesterId) {
			query = query.eq('requester_id', requesterId);
		}

		if (targetId) {
			query = query.eq('target_id', targetId);
		}

		if (status) {
			query = query.eq('status', status);
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

	async create(payload: CreateOwnerRelationshipDB) {
		const { data, error } = await this.db
			.from('owner_relationships')
			.insert(payload)
			.select()
			.single();

		if (error) throw new Error(error.message);
		return data;
	}

	async update(id: string, payload: UpdateOwnerRelationshipFromZod) {
		const { data, error } = await this.db
			.from('owner_relationships')
			.update({ ...payload, updated_at: new Date().toISOString() })
			.eq('id', id)
			.select()
			.single();

		if (error) throw new Error(error.message);
		return data;
	}

	async delete(id: string) {
		const { error } = await this.db
			.from('owner_relationships')
			.delete()
			.eq('id', id);

		if (error) throw new Error(error.message);
		return true;
	}

	async approve(id: string) {
		const { data, error } = await this.db
			.from('owner_relationships')
			.update({ status: 'approved', updated_at: new Date().toISOString() })
			.eq('id', id)
			.select()
			.single();

		if (error) throw new Error(error.message);
		return data;
	}

	async reject(id: string, notes?: string) {
		const updateData: any = { status: 'rejected', updated_at: new Date().toISOString() };
		if (notes !== undefined) {
			updateData.notes = notes;
		}

		const { data, error } = await this.db
			.from('owner_relationships')
			.update(updateData)
			.eq('id', id)
			.select()
			.single();

		if (error) throw new Error(error.message);
		return data;
	}
}
