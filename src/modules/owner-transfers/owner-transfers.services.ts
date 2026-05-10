import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../../shared/supabase/types';
import { ListOwnerTransfersParams, UpdateOwnerTransferFromZod, CreateOwnerTransferDB, OwnerTransferItemDB } from './owner-transfers.types';

export class OwnerTransfersService {
	constructor(private db: SupabaseClient<Database>) {}

	async getAll() {
		const { data, error } = await this.db
			.from('owner_transfers')
			.select('*, owner_transfer_items(*)');
		if (error) throw new Error(error.message);
		return data;
	}

	async getOne(id: string) {
		const { data, error } = await this.db
			.from('owner_transfers')
			.select('*, owner_transfer_items(*)')
			.eq('id', id)
			.maybeSingle();
		if (error) throw new Error(error.message);
		return data;
	}

	async list(params: ListOwnerTransfersParams) {
		const { page, pageSize, sellerOwnerId, buyerOwnerId, fromBranchId, toBranchId, status, currency, sortBy, sortDir } = params;

		const from = (page - 1) * pageSize;
		const to = from + pageSize - 1;

		let query = this.db
			.from('owner_transfers')
			.select('*, owner_transfer_items(*)', { count: 'exact' });

		if (sellerOwnerId) {
			query = query.eq('seller_owner_id', sellerOwnerId);
		}

		if (buyerOwnerId) {
			query = query.eq('buyer_owner_id', buyerOwnerId);
		}

		if (fromBranchId) {
			query = query.eq('from_branch_id', fromBranchId);
		}

		if (toBranchId) {
			query = query.eq('to_branch_id', toBranchId);
		}

		if (status) {
			query = query.eq('status', status);
		}

		if (currency) {
			query = query.eq('currency', currency);
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
		seller_owner_id: string;
		buyer_owner_id: string;
		from_branch_id: string;
		to_branch_id: string;
		agreed_price?: number | null;
		currency: 'MXN' | 'USD' | 'EUR';
		notes?: string | null;
		created_by?: string | null;
		items: Omit<OwnerTransferItemDB, 'id' | 'owner_transfer_id'>[];
	}) {
		const { items, ...transferData } = payload;

		const { data: transfer, error: transferError } = await this.db
			.from('owner_transfers')
			.insert(transferData)
			.select()
			.single();

		if (transferError) throw new Error(transferError.message);

		const transferItems = items.map((item) => ({
			...item,
			owner_transfer_id: transfer.id,
		}));

		const { error: itemsError } = await this.db
			.from('owner_transfer_items')
			.insert(transferItems);

		if (itemsError) throw new Error(itemsError.message);

		return this.getOne(transfer.id);
	}

	async update(id: string, payload: UpdateOwnerTransferFromZod) {
		const { data, error } = await this.db
			.from('owner_transfers')
			.update(payload)
			.eq('id', id)
			.select()
			.single();

		if (error) throw new Error(error.message);
		return data;
	}

	async delete(id: string) {
		const { error } = await this.db
			.from('owner_transfers')
			.delete()
			.eq('id', id);

		if (error) throw new Error(error.message);
		return true;
	}

	async send(id: string) {
		const { data, error } = await this.db
			.from('owner_transfers')
			.update({ status: 'sent', sent_at: new Date().toISOString() })
			.eq('id', id)
			.select()
			.single();

		if (error) throw new Error(error.message);
		return data;
	}

	async receive(id: string, receivedBy: string) {
		const { data, error } = await this.db
			.from('owner_transfers')
			.update({
				status: 'received',
				received_at: new Date().toISOString(),
				received_by: receivedBy,
			})
			.eq('id', id)
			.select()
			.single();

		if (error) throw new Error(error.message);
		return data;
	}

	async cancel(id: string) {
		const { data, error } = await this.db
			.from('owner_transfers')
			.update({ status: 'cancelled' })
			.eq('id', id)
			.select()
			.single();

		if (error) throw new Error(error.message);
		return data;
	}
}
