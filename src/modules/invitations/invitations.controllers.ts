import { Context } from 'hono';
import { BaseController } from '../../shared/utils/base.controller';
import { serverError, successResponse, validationError } from '../../shared/utils/response';
import {
	AcceptInvitationRequestSchema,
	InviteUserRequestSchema,
	ValidateInvitationRequestSchema,
	ValidateInvitationResponseSchema,
} from './invitations.schemas';
import { AppContext } from '../../shared/supabase/general';
import { extractBearerToken } from '../../shared/supabase/helpers';
import { createAdminClient } from '../../infra/supabase/admin.client';
import { ZodError } from 'zod';
import { InvitationsService } from './invitations.services';

export class InviteUserController extends BaseController {
	schema = {
		tags: ['Invitations'],
		summary: 'Invite a new user',
		operationId: 'inviteUser',
		security: [{ BearerAuth: [] }],
		request: {
			body: this.createBodySchema(InviteUserRequestSchema),
		},
		responses: this.createNoContentResponse({
			include400: true,
			includeAuth: true,
			include404: true,
		}),
	};

	async handle(c: Context<AppContext>) {
		try {
			const data = await this.getValidatedData<typeof this.schema>();
			const supabaseAdmin = createAdminClient(c.env);
			const service = new InvitationsService(supabaseAdmin, c);
			const payload = data.body;

			const profile = c.get('profile');
			if (!profile) {
				return serverError(c, 'Profile not found');
			}

			await service.createInvitation({
				userData: {
					email: payload.email,
					owner_id: profile.owner_id!,
					invited_by: profile.user_id!,
					role: payload.role,
					branch_id: payload.branch_id ?? undefined,
				},
				redirectTo: c.env.FRONTEND_URL + '/onboarding',
			});

			return successResponse(c, 'User invited successfully');
		} catch (error) {
			if (error instanceof ZodError) {
				return validationError(c, error);
			}
			return serverError(c, error);
		}
	}
}

export class ValidateInvitationController extends BaseController {
	schema = {
		tags: ['Invitations'],
		summary: 'Validate an invitation',
		operationId: 'validateInvitation',
		request: {
			body: this.createBodySchema(ValidateInvitationRequestSchema),
		},
		responses: this.createStandardResponses(ValidateInvitationResponseSchema, {
			successDescription: 'Invitation validated successfully',
			include400: true,
			includeAuth: true,
			include404: true,
		}),
	};

	async handle(c: Context<AppContext>) {
		try {
			const data = await this.getValidatedData<typeof this.schema>();
			const { token } = data.body;
			const supabase = createAdminClient(c.env);
			const service = new InvitationsService(supabase, c);

			const validationData = await service.validateInvitation(token);

			return successResponse(c, validationData, 'Invitation validated successfully');
		} catch (error) {
			if (error instanceof ZodError) {
				return validationError(c, error);
			}
			return serverError(c, error);
		}
	}
}

export class AcceptInvitationController extends BaseController {
	schema = {
		tags: ['Invitations'],
		summary: 'Accept an invitation',
		operationId: 'acceptInvitation',
		security: [{ BearerAuth: [] }],
		request: {
			body: this.createBodySchema(AcceptInvitationRequestSchema),
		},
		responses: this.createNoContentResponse({
			include400: true,
			includeAuth: true,
			include404: true,
		}),
	};

	async handle(c: Context<AppContext>) {
		try {
			const data = await this.getValidatedData<typeof this.schema>();
			const supabaseAdmin = createAdminClient(c.env);
			const service = new InvitationsService(supabaseAdmin, c);
			const payload = data.body;

			const token = extractBearerToken(c.req.header('Authorization'));
			if (!token) {
				return validationError(c, 'No token provided');
			}
			const {
				data: { user },
				error: authError,
			} = await supabaseAdmin.auth.getUser(token);
			if (authError || !user) {
				return validationError(c, 'User not found');
			}

			const result = await service.acceptInvitation({
				user_id: user.id,
				email: user.email!,
				owner_id: user.user_metadata?.owner_id,
				name: user.user_metadata?.name ?? user.email!.split('@')[0],
				role: user.user_metadata?.role ?? 'branch_staff',
				branch_id: user.user_metadata?.branch_id ?? undefined,
				phone: user.user_metadata?.phone ?? null,
				avatar_url: payload.avatar_url ?? null,
				// owner
				business_name: payload.business_name,
				logo_url: payload.logo_url,
			});

			return successResponse(c, result, 'Invitation accepted successfully');
		} catch (error) {
			if (error instanceof ZodError) {
				return validationError(c, error);
			}
			return serverError(c, error);
		}
	}
}
