import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../../shared/supabase/types';
import { ListProfilesParams, UpdateUserFromZod, UserDB } from './users.types';
import { mapUserDbToApi } from './users.transforms';

export class UsersService {
	constructor(private db: SupabaseClient<Database>) {}

	async getMe() {
		const { data: profile, error } = await this.db.schema('core').from('v_my_profile').select('*').maybeSingle();

		if (error) throw new Error(error.message);

		try {
			return mapUserDbToApi(profile as UserDB);
		} catch (error) {
			console.error('Profile validation error:', error);
			throw new Error('Invalid profile data from database');
		}
	}

	async getAll() {
		const { data, error } = await this.db.schema('core').from('v_user_profiles').select('*');
		if (error) throw new Error(error.message);

		return data;
	}

	async getOne(id: string) {
		const { data, error } = await this.db.schema('core').from('v_user_profiles').select('*').eq('id', id).single();

		if (error) throw new Error(error.message);

		return data;
	}

	async listProfiles(params: ListProfilesParams) {
		const { page, pageSize, search, status, fromDate, toDate, sortBy, sortDir } = params;

		const from = (page - 1) * pageSize;
		const to = from + pageSize - 1;

		let query = this.db
			.schema('core')
			.from('v_user_profiles')
			.select(
				`
                id,
                email,
                first_name,
                last_name,
                full_name,
                avatar_url,
                status,
                created_at,
                updated_at,
                role_id,
                role_name,
				company_id,
                company_name,
                is_root,
                is_owner,
                permissions
                `,
				{ count: 'exact' },
			);

		// 🔍 búsqueda por texto
		if (search) {
			query = query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%`);
		}

		// 🏷 filtro por estatus
		if (status) {
			query = query.eq('status', status);
		}

		// 📅 filtro por fecha
		if (fromDate) {
			query = query.gte('created_at', `${fromDate}T00:00:00`);
		}

		if (toDate) {
			query = query.lte('created_at', `${toDate}T23:59:59`);
		}

		// ↕️ orden
		query = query.order(sortBy, { ascending: sortDir === 'asc' });

		// 📄 paginación
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

	async isUserInvited(email: string) {
		const { data, error } = await this.db.schema('core').from('invitations').select('id').eq('email', email).single();
		if (error) throw new Error(error.message);
		return data;
	}

	async update(id: string, payload: UpdateUserFromZod) {
		const { role_id, ...profileData } = payload;

		const { error } = await this.db.schema('core').from('profiles').update(profileData).eq('id', id).neq('status', 'deleted');

		if (error) throw new Error(error.message);
	}

	async delete(id: string) {
		const { error } = await this.db
			.schema('core')
			.from('profiles')
			.update({ status: 'deleted', deleted_at: new Date().toISOString() })
			.eq('id', id);

		if (error) throw new Error(error.message);
	}
}
