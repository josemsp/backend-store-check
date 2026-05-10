import z from 'zod';
import { InvitationDBSchema } from './invitations.schemas';
import { Database } from '../../shared/supabase';
import { UserRoleDB } from '../users/users.types';

export type InvitationDB = Database['public']['Tables']['invitations']['Row'];

// Compare UserProfileData with UserFromZod.
const itShouldBeOk = InvitationDBSchema as z.ZodType<InvitationDB>;

export type InviteUserInput = {
	email: string;
	owner_id: string;
	invited_by: string;
	role: UserRoleDB;
	branch_id?: string | null;
};

export type AcceptInvitationInput = {
	user_id: string;
	email: string;
	owner_id: string;
	name: string;
	role: UserRoleDB;
	branch_id?: string | null;
	phone?: string | null;
	avatar_url?: string | null;
};
