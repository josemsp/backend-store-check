import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../../shared/supabase/types';
import { Context } from 'hono';
import { AppContext } from '../../shared/supabase/general';
import { Resend } from 'resend';
import { InvitationEmail } from '../../infra/email/templates/Invitation';
import { AcceptInvitationInput, InviteUserInput } from './invitations.types';
import { HTTPException } from 'hono/http-exception';
import { errorResponse, validationError } from '../../shared/utils/response';

export class InvitationsService {
	constructor(
		private supabase: SupabaseClient<Database>,
		private context: Context<AppContext>,
	) {}

	async createInvitation({ redirectTo, userData }: { redirectTo?: string; userData: InviteUserInput }) {
		const { email, owner_id, invited_by, role, branch_id } = userData;

		const token = crypto.randomUUID();
		const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

		const { data: existing } = await this.supabase
			.from('invitations')
			.select('id')
			.eq('email', email)
			.eq('owner_id', owner_id)
			.eq('status', 'pending')
			.maybeSingle();

		if (existing) {
			const { error: updateError } = await this.supabase
				.from('invitations')
				.update({
					token,
					expires_at: expiresAt,
					invited_by,
					role,
					branch_id: branch_id ?? null,
				})
				.eq('id', existing.id);

			if (updateError) throw new Error(updateError.message);
		} else {
			const { error: insertError } = await this.supabase.from('invitations').insert({
				email,
				owner_id: owner_id,
				branch_id: branch_id ?? undefined,
				role,
				invited_by: invited_by,
				token,
				status: 'pending',
				is_system_invite: false,
				expires_at: expiresAt,
			});

			if (insertError) throw new Error(insertError.message);
		}

		const { data, error } = await this.supabase.auth.admin.generateLink({
			type: 'magiclink',
			email,
			options: {
				redirectTo: `${redirectTo}?token=${token}`,
				data: {
					owner_id: owner_id,
					role,
					invitation_token: token,
				},
			},
		});

		if (error) {
			await this.supabase.from('invitations').delete().eq('token', token);
			throw new Error(error.message);
		}

		const actionLink = data.properties.action_link;
		const resend = new Resend(this.context.env.RESEND_API_KEY);

		const response = await resend.emails.send({
			from: 'STORE-CHECK <onboarding@resend.dev>',
			to: [email],
			subject: 'Invitation to join Store Check',
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			react: InvitationEmail({ actionLink, roleName: role as any }),
		});

		if (response.error) {
			await this.supabase.from('invitations').delete().eq('token', token);
			throw new Error(response.error.message);
		}

		return response.data;
	}

	async validateInvitation(token: string) {
		const { data, error } = await this.supabase
			.from('invitations')
			.select('email, role, status, expires_at')
			.eq('token', token)
			.maybeSingle();

		if (error) {
			throw new HTTPException(400, {
				res: errorResponse(this.context, 'DATABASE_ERROR', error.message, 400),
			});
		}

		if (!data) {
			throw new HTTPException(404, {
				res: errorResponse(this.context, 'NOT_FOUND', 'Invitation not found', 404),
			});
		}

		if (data.status === 'accepted') {
			throw new HTTPException(400, {
				res: errorResponse(this.context, 'INVITATION_ALREADY_ACCEPTED', 'Invitation already accepted', 400),
			});
		}

		if (data.expires_at && data.expires_at < new Date().toISOString()) {
			throw new HTTPException(400, {
				res: validationError(this.context, {
					expires_at: 'Invitation expired',
				}),
			});
		}

		return {
			email: data.email,
			role: data.role,
		};
	}

	async acceptInvitation(payload: AcceptInvitationInput) {
		const { user_id, email, owner_id, name, role, branch_id, avatar_url, business_name, logo_url } = payload;

		const { data: invitation, error: invitationError } = await this.supabase
			.from('invitations')
			.select('*')
			.eq('email', email)
			.eq('owner_id', owner_id)
			.eq('status', 'pending')
			.single();

		if (invitationError || !invitation) {
			throw new HTTPException(404, {
				res: errorResponse(this.context, 'NOT_FOUND', 'No pending invitation found', 404),
			});
		}

		if (invitation.expires_at && new Date(invitation.expires_at) < new Date()) {
			await this.supabase.from('invitations').update({ status: 'expired' }).eq('id', invitation.id);
			throw new HTTPException(400, {
				res: errorResponse(this.context, 'INVITATION_EXPIRED', 'Invitation has expired', 400),
			});
		}

		const { error: profileError } = await this.supabase.from('user_profiles').upsert({
			id: user_id,
			owner_id: owner_id,
			name,
			role,
			branch_id: branch_id || null,
			avatar_url: avatar_url || null,
			is_active: true,
		});

		if (profileError) throw new Error(profileError.message);

		await this.supabase.from('invitations').update({ status: 'accepted' }).eq('id', invitation.id);

		if (role === 'owner') {
			const { error: ownerError } = await this.supabase.from('owners').insert({
				name,
				business_name: business_name ?? '',
				email,
				logo_url,
			});

			if (ownerError) throw new Error(ownerError.message);
		}

		return {
			acceptedAt: new Date(),
			invitationStatus: 'accepted',
		};
	}
}
