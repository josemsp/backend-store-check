import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../../shared/supabase/types';
import { ListTransfersParams, UpdateTransferFromZod, TransferItemDB } from './transfers.types';

export class TransfersService {
	constructor(private db: SupabaseClient<Database>) {}

	async getAll() {
		const { data, error } = await this.db
			.from('transfers')
			.select('*, transfer_items(*)');
		if (error) throw new Error(error.message);
		return data;
	}

	async getOne(id: string) {
		const { data, error } = await this.db
			.from('transfers')
			.select('*, transfer_items(*)')
			.eq('id', id)
			.maybeSingle();
		if (error) throw new Error(error.message);
		return data;
	}

	async list(params: ListTransfersParams) {
		const { page, pageSize, search, ownerId, fromBranchId, toBranchId, status, transferType, sortBy, sortDir } = params;

		const from = (page - 1) * pageSize;
		const to = from + pageSize - 1;

		let query = this.db
			.from('transfers')
			.select('*, transfer_items(*)', { count: 'exact' });

		if (ownerId) {
			query = query.eq('owner_id', ownerId);
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

		if (transferType) {
			query = query.eq('transfer_type', transferType);
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
		from_branch_id: string | null;
		to_branch_id: string;
		transfer_type: 'internal' | 'external';
		notes?: string | null;
		items: Omit<TransferItemDB, 'id' | 'transfer_id'>[];
	}) {
		const { items, ...transferData } = payload;

		const { data: transfer, error: transferError } = await this.db
			.from('transfers')
			.insert(transferData)
			.select()
			.single();

		if (transferError) throw new Error(transferError.message);

		const transferItems = items.map((item) => ({
			...item,
			transfer_id: transfer.id,
		}));

		const { error: itemsError } = await this.db
			.from('transfer_items')
			.insert(transferItems);

		if (itemsError) throw new Error(itemsError.message);

		return this.getOne(transfer.id);
	}

	async update(id: string, payload: UpdateTransferFromZod) {
		const { data, error } = await this.db
			.from('transfers')
			.update(payload)
			.eq('id', id)
			.select()
			.single();

		if (error) throw new Error(error.message);
		return data;
	}

	async delete(id: string) {
		const { error } = await this.db
			.from('transfers')
			.delete()
			.eq('id', id);

		if (error) throw new Error(error.message);
		return true;
	}

	async updateStatus(id: string, status: 'pending' | 'sent' | 'received' | 'cancelled', additionalData?: { receivedBy?: string }) {
		const updateData: any = { status };

		if (status === 'sent') {
			updateData.sent_at = new Date().toISOString();
		}

		if (status === 'received') {
			updateData.received_at = new Date().toISOString();
			if (additionalData?.receivedBy) {
				updateData.received_by = additionalData.receivedBy;
			}
		}

		const { data, error } = await this.db
			.from('transfers')
			.update(updateData)
			.eq('id', id)
			.select()
			.single();

		if (error) throw new Error(error.message);
		return data;
	}
}
