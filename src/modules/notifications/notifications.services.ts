import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../../shared/supabase/types';
import { ListNotificationsParams, UpdateNotificationFromZod, CreateNotificationDB, MarkAsReadInput } from './notifications.types';

export class NotificationsService {
	constructor(private db: SupabaseClient<Database>) {}

	async getAll() {
		const { data, error } = await this.db
			.from('notifications')
			.select('*');
		if (error) throw new Error(error.message);
		return data;
	}

	async getOne(id: string) {
		const { data, error } = await this.db
			.from('notifications')
			.select('*')
			.eq('id', id)
			.maybeSingle();
		if (error) throw new Error(error.message);
		return data;
	}

	async list(params: ListNotificationsParams) {
		const { page, pageSize, ownerId, userId, type, isRead, channel, platform, sortBy, sortDir } = params;

		const from = (page - 1) * pageSize;
		const to = from + pageSize - 1;

		let query = this.db
			.from('notifications')
			.select('*', { count: 'exact' });

		if (ownerId) {
			query = query.eq('owner_id', ownerId);
		}

		if (userId) {
			query = query.eq('user_id', userId);
		}

		if (type) {
			query = query.eq('type', type);
		}

		if (isRead !== undefined) {
			query = query.eq('is_read', isRead);
		}

		if (channel) {
			query = query.eq('channel', channel);
		}

		if (platform) {
			query = query.eq('platform', platform);
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

	async create(payload: CreateNotificationDB) {
		const { data, error } = await this.db
			.from('notifications')
			.insert(payload)
			.select()
			.single();

		if (error) throw new Error(error.message);
		return data;
	}

	async update(id: string, payload: UpdateNotificationFromZod) {
		const { data, error } = await this.db
			.from('notifications')
			.update(payload)
			.eq('id', id)
			.select()
			.single();

		if (error) throw new Error(error.message);
		return data;
	}

	async delete(id: string) {
		const { error } = await this.db
			.from('notifications')
			.delete()
			.eq('id', id);

		if (error) throw new Error(error.message);
		return true;
	}

	async markAsRead(ids: string[]) {
		const { data, error } = await this.db
			.from('notifications')
			.update({ is_read: true })
			.in('id', ids)
			.select();

		if (error) throw new Error(error.message);
		return data;
	}

	async markAllAsRead(ownerId: string, userId?: string) {
		let query = this.db
			.from('notifications')
			.update({ is_read: true })
			.eq('owner_id', ownerId)
			.eq('is_read', false);

		if (userId) {
			query = query.eq('user_id', userId);
		}

		const { data, error } = await query.select();

		if (error) throw new Error(error.message);
		return data;
	}
}
