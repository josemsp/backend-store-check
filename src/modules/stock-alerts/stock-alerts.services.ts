import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../../shared/supabase/types';
import { ListStockAlertsParams, UpdateStockAlertFromZod } from './stock-alerts.types';

export class StockAlertsService {
	constructor(private db: SupabaseClient<Database>) {}

	async getAll() {
		const { data, error } = await this.db
			.from('stock_alerts')
			.select('*');
		if (error) throw new Error(error.message);
		return data;
	}

	async getOne(id: string) {
		const { data, error } = await this.db
			.from('stock_alerts')
			.select('*')
			.eq('id', id)
			.maybeSingle();
		if (error) throw new Error(error.message);
		return data;
	}

	async list(params: ListStockAlertsParams) {
		const { page, pageSize, search, ownerId, branchId, productId, status, sortBy, sortDir } = params;

		const from = (page - 1) * pageSize;
		const to = from + pageSize - 1;

		let query = this.db
			.from('stock_alerts')
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

	async create(payload: {
		owner_id: string;
		branch_id: string;
		product_id: string;
		quantity: number;
		threshold: number;
		status?: 'active' | 'resolved' | 'dismissed';
	}) {
		const { data, error } = await this.db
			.from('stock_alerts')
			.insert(payload)
			.select()
			.single();

		if (error) throw new Error(error.message);
		return data;
	}

	async update(id: string, payload: UpdateStockAlertFromZod) {
		const { data, error } = await this.db
			.from('stock_alerts')
			.update(payload)
			.eq('id', id)
			.select()
			.single();

		if (error) throw new Error(error.message);
		return data;
	}

	async delete(id: string) {
		const { error } = await this.db
			.from('stock_alerts')
			.delete()
			.eq('id', id);

		if (error) throw new Error(error.message);
		return true;
	}

	async resolveAlert(id: string, resolvedBy: string) {
		const { data, error } = await this.db
			.from('stock_alerts')
			.update({
				status: 'resolved' as const,
				resolved_at: new Date().toISOString(),
				resolved_by: resolvedBy,
			})
			.eq('id', id)
			.select()
			.single();

		if (error) throw new Error(error.message);
		return data;
	}

	async dismissAlert(id: string) {
		const { data, error } = await this.db
			.from('stock_alerts')
			.update({
				status: 'dismissed' as const,
			})
			.eq('id', id)
			.select()
			.single();

		if (error) throw new Error(error.message);
		return data;
	}
}
