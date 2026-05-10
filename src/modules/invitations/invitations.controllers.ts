import { Context } from "hono";
import { BaseController } from "../../shared/utils/base.controller";
import { serverError, successResponse, validationError } from "../../shared/utils/response";
import {
    InviteUserAPISchema,
    AcceptInvitationAPISchema,
    AcceptInvitationAPISchemaResponse
} from "./invitations.schemas";
import { AppContext } from "../../shared/supabase/general";
import { extractBearerToken } from "../../shared/supabase/helpers";
import { createAdminClient } from "../../infra/supabase/admin.client";
import { ZodError } from "zod";
import { InvitationsService } from "./invitations.services";
import { InviteUserDBSchema } from "./invitations.schemas";

export class InviteUserController extends BaseController {
    schema = {
        tags: ['Invitations'],
        summary: 'Invite a new user',
        operationId: 'inviteUser',
        security: [{ BearerAuth: [] }],
        request: {
            body: this.createBodySchema(InviteUserAPISchema)
        },
        responses: this.createStandardResponses(InviteUserAPISchema, {
            successDescription: "User invited successfully",
            include400: true,
            includeAuth: true,
            include404: true
        }),
    }

    async handle(c: Context<AppContext>) {
        try {
            const data = await this.getValidatedData<typeof this.schema>();
            const payload = InviteUserDBSchema.parse(data.body);
            const supabaseAdmin = createAdminClient(c.env);
            const service = new InvitationsService(supabaseAdmin, c);

            const profile = c.get('profile');
            if (!profile) {
                return serverError(c, 'Profile not found');
            }

            await service.createInvitation({
                userData: {
                    email: payload.email,
                    ownerId: payload.owner_id,
                    name: payload.name,
                    role: payload.role,
                    branchId: payload.branch_id || undefined,
                    phone: payload.phone || undefined,
                },
                redirectTo: c.env.FRONTEND_URL + '/onboarding'
            });

            return successResponse(c, { email: payload.email }, "User invited successfully");
        } catch (error) {
            console.error('InviteUserController error:', error);
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
            body: this.createBodySchema(AcceptInvitationAPISchema)
        },
        responses: this.createStandardResponses(AcceptInvitationAPISchemaResponse, {
            successDescription: "Invitation accepted successfully",
            include400: true,
            includeAuth: true,
            include404: true
        }),
    }

    async handle(c: Context<AppContext>) {
        try {
            const data = await this.getValidatedData<typeof this.schema>();
            const payload = AcceptInvitationAPISchema.parse(data.body);
            const supabaseAdmin = createAdminClient(c.env);
            const service = new InvitationsService(supabaseAdmin, c);

            const token = extractBearerToken(c.req.header('Authorization'));
            if (!token) {
                return validationError(c, 'No token provided');
            }
            const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
            if (authError || !user) {
                return validationError(c, 'User not found');
            }

            const result = await service.acceptInvitation({
                userId: user.id,
                email: user.email!,
                ownerId: user.user_metadata?.owner_id,
                name: user.user_metadata?.name || user.email!.split('@')[0],
                role: user.user_metadata?.role || 'viewer',
                branchId: user.user_metadata?.branch_id || null,
                phone: user.user_metadata?.phone || null,
                avatarUrl: payload.avatarUrl || null,
            });

            return successResponse(c, result, "Invitation accepted successfully");
        } catch (error) {
            console.error('AcceptInvitationController error:', error);
            if (error instanceof ZodError) {
                return validationError(c, error);
            }
            return serverError(c, error);
        }
    }
}
