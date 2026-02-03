import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../../shared/supabase/types';
import { PermissionKey } from './permission.schemas';

export class PermissionService {
	constructor(private supabase: SupabaseClient<Database>) {}

	async assignPermissions({ userId, permissionKeys }: { userId: string; permissionKeys: PermissionKey[] }) {
		await this.supabase
			.schema('core')
			.from('user_permissions')
			.insert(
				permissionKeys.map((p) => ({
					user_id: userId,
					permission: p,
				})),
			);
	}
}
