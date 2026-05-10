import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../../shared/supabase/types';
import { UserDB, UserProfileOwnerDB, UserProfileRootDB, PaginationParams } from './users.types';
import { paginate } from './users.helpers';

export class RootUserService {
	constructor(private db: SupabaseClient<Database>) {}

	async getUser(id: string) {
		const { data, error } = await this.db.from('v_users_full').select('*').eq('id', id).maybeSingle();
		if (error) throw new Error(error.message);
		if (!data) return undefined;
		return data;
	}

	async getAll(params: PaginationParams) {
		const { page, page_size, search, is_active, sort_by, sort_order } = params;

		let query = this.db.from('v_users_full').select('*', { count: 'exact' });

		if (search) {
			query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%,role.ilike.%${search}%`);
		}
		/* Filters */
		if (is_active !== undefined) {
			query = query.eq('is_active', is_active);
		}

		/* Order */
		query = query.order(sort_by || 'created_at', { ascending: sort_order === 'asc' });

		/* Pagination */
		return paginate<UserProfileRootDB>(query, { page, page_size });
	}
}

export class OwnerUserService {
	constructor(private db: SupabaseClient<Database>) {}

	async getUser(id: string) {
		const { data, error } = await this.db.from('v_company_users').select('*').eq('id', id).maybeSingle();
		if (error) throw new Error(error.message);
		if (!data) return undefined;
		return data;
	}

	async getAll(params: PaginationParams) {
		const { page, page_size, search, is_active, sort_by, sort_order } = params;

		let query = this.db.from('v_company_users').select('*', { count: 'exact' });

		/* Search */
		if (search) {
			query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%,role.ilike.%${search}%`);
		}

		/* Filters */
		if (is_active !== undefined) {
			query = query.eq('is_active', is_active);
		}

		/* Order */
		query = query.order(sort_by || 'created_at', { ascending: sort_order === 'asc' });

		/* Pagination */
		return paginate<UserProfileOwnerDB>(query, { page, page_size });
	}
}

export class UserService {
	constructor(private db: SupabaseClient<Database>) {}

	async getMe() {
		const {
			data: { user },
		} = await this.db.auth.getUser();
		if (!user) throw new Error('User not authenticated');

		const { data: profile, error } = await this.db.from('v_current_user').select(`*`).maybeSingle();

		if (error) throw new Error(error.message);
		if (!profile) return undefined;

		return profile;
	}

	async isUserInvited(email: string) {
		const { data, error } = await this.db.from('owners').select('id').eq('email', email).maybeSingle();
		if (error) throw new Error(error.message);
		return data;
	}

	async update(id: string, payload: Partial<UserDB>) {
		const { error } = await this.db.from('user_profiles').update(payload).eq('id', id).select();

		if (error) throw new Error(error.message);
	}

	async delete(id: string) {
		const { error } = await this.db.from('user_profiles').update({ is_active: false }).eq('id', id);

		if (error) throw new Error(error.message);
	}

	async create(payload: {
		id: string;
		owner_id: string;
		name: string;
		role: Database['public']['Enums']['user_role'];
		email: string;
		branch_id?: string | null;
		phone?: string | null;
		avatar_url?: string | null;
	}) {
		const { data, error } = await this.db.from('user_profiles').insert(payload).select().single();

		if (error) throw new Error(error.message);
		return data;
	}
}
