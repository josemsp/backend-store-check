import z, { success } from 'zod';
import { RoleEnum } from '../users/users.schemas';

export const InvitationStatusEnum = z.enum(['pending', 'accepted', 'expired']);

export const InvitationDBSchema = z.object({
	id: z.uuid(),
	owner_id: z.uuid(),
	email: z.email(),
	branch_id: z.uuid().nullable(),
	role: RoleEnum,
	status: InvitationStatusEnum,
	expires_at: z.iso.datetime({ offset: true }).nullable(),
	created_at: z.iso.datetime({ offset: true }).nullable(),
	token: z.uuid(),
	invited_by: z.uuid().nullable(),
	is_system_invite: z.boolean(),
});

export const InviteUserRequestSchema = z.object({
	email: z.email(),
	branch_id: z.uuid().optional(),
	role: RoleEnum.default('branch_staff'),
});

export const AcceptInvitationRequestSchema = z.object({
	token: z.string(),
	avatar_url: z.string().optional(),
	// owners
	business_name: z.string().optional(),
	logo_url: z.string().optional(),
});

export const ValidateInvitationRequestSchema = z.object({
	token: z.string(),
});

export const ValidateInvitationResponseSchema = z.object({
	success: z.literal(true),
	message: z.string().optional(),
	data: z.object({
		email: z.email(),
		role: RoleEnum,
	}),
	meta: z.object({ timestamp: z.iso.datetime({ offset: true }) }),
});
