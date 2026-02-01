import { Context } from "hono";
import { BaseController } from "../../shared/utils/base.controller";
import { serverError, successResponse, validationError } from "../../shared/utils/response";
import {
    InvitationsOwnerAPISchema,
    InvitationsOwnerAPISchemaResponse,
    ValidateInvitationAPISchema,
    ValidateInvitationAPISchemaResponse,
    AcceptInvitationAPISchema,
    AcceptInvitationAPISchemaResponse
} from "./invitations.schemas";
import { AppContext } from "../../shared/supabase/general";
import { extractBearerToken } from "../../shared/supabase/helpers";
import { createAdminClient } from "../../infra/supabase/admin.client";
import { RolesService } from "../roles/roles.services";
import { ZodError } from "zod";
import { InvitationsService } from "./invitations.services";

export class InviteUserOwnerController extends BaseController {
    schema = {
        tags: ['Invitations'],
        summary: 'Invite a new user owner',
        operationId: 'inviteUserOwner',
        security: [{ BearerAuth: [] }],
        request: {
            body: this.createBodySchema(InvitationsOwnerAPISchema)
        },
        responses: this.createStandardResponses(InvitationsOwnerAPISchemaResponse, {
            successDescription: "User invited successfully",
            include400: true,
            includeAuth: true,
            include404: true
        }),
    }

    async handle(c: Context<AppContext>) {
        try {
            const data = await this.getValidatedData<typeof this.schema>();
            const { email } = InvitationsOwnerAPISchema.parse(data.body)
            const supabaseAdmin = createAdminClient(c.env);
            const service = new InvitationsService(supabaseAdmin, c);
            const token = crypto.randomUUID();

            const role = await new RolesService(c.get('supabase')).getRoleByName('owner');
            if (!role) {
                return serverError(c, 'Role not found');
            }

            const profile = c.get('profile');
            if (!profile) {
                return serverError(c, 'Profile not found'); // Or unauthorizedError if imported
            }

            await service.createInvitation({
                userData: {
                    email,
                    invitedBy: profile.id,
                    roleId: role.id,
                    roleName: role.name,
                    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 48), // 48 hours
                    token
                },
                redirectTo: c.env.FRONTEND_URL + '/onboarding?token=' + token
            });

            return successResponse(c, { email }, "User invited successfully");
        } catch (error) {
            console.error('InviteUserController error:', error);
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
            body: this.createBodySchema(ValidateInvitationAPISchema)
        },
        responses: this.createStandardResponses(ValidateInvitationAPISchemaResponse, {
            successDescription: "Invitation validated successfully",
            include400: true,
            includeAuth: true,
            include404: true
        }),
    }

    async handle(c: Context<AppContext>) {
        try {
            const data = await this.getValidatedData<typeof this.schema>();
            const { token } = ValidateInvitationAPISchema.parse(data.body)
            // const supabase = c.get('supabase');
            const supabase = createAdminClient(c.env); // Use admin for generic validation just in case, or anon is fine? Validation reads `invitations`. RLS usually blocks anon.
            // If RLS blocks anon, we must use Admin or a specific client.
            // `createAdminClient` is safer for public endpoints checking secure tables if RLS is tight.
            const service = new InvitationsService(supabase, c);

            const invitation = await service.validateInvitation(token);

            const validatedInvitation = ValidateInvitationAPISchemaResponse.parse({
                email: invitation.email,
                roleName: invitation.role_name,
                isNewCompany: invitation.is_new_company
            });

            return successResponse(c, validatedInvitation, "Invitation validated successfully");
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
            const payload = AcceptInvitationAPISchema.parse(data.body)
            const supabaseAdmin = createAdminClient(c.env);
            const service = new InvitationsService(supabaseAdmin, c);

            const token = extractBearerToken(c.req.header('Authorization'));
            if (!token) {
                return validationError(c, 'No token provided');
            }
            let userId = (await supabaseAdmin.auth.getUser(token)).data.user?.id;
            if (!userId) {
                return validationError(c, 'User not found');
            }
            const result = await service.acceptInvitation({
                ...payload,
                userId
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

