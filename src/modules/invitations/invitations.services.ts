import { SupabaseClient } from "@supabase/supabase-js";
import { AcceptInvitationInput, InvitationsInput } from "./invitations.types";
import { Context } from "hono";
import { AppContext } from "../../shared/supabase/general";
import { Database } from "../../shared/supabase/types";
import { Resend } from "resend";
import { InvitationEmail } from "../../infra/email/templates/Invitation";

export class InvitationsService {
    constructor(private supabase: SupabaseClient<Database>, private context: Context<AppContext>, private userId?: string) { }

    async createInvitation({ redirectTo, userData }: { redirectTo?: string, userData: InvitationsInput }) {
        const { email, roleId, companyId, expiresAt, token, invitedBy, roleName } = userData;

        const { error } = await this.supabase
            .schema('core')
            .from('invitations')
            .upsert({
                email,
                role_id: roleId,
                company_id: companyId,
                token,
                invited_by: invitedBy,
                expires_at: expiresAt.toISOString(),
            }, { onConflict: 'email' });

        if (error) throw new Error(error.message);

        const { data, error: errorInvitation } = await this.supabase.auth.admin.generateLink({
            type: 'magiclink',
            email,
            options: {
                redirectTo,
                data: {
                    role_id: roleId,
                    company_id: companyId,
                    role_name: roleName
                }
            }
        });

        if (errorInvitation) throw new Error(errorInvitation.message);

        const actionLink = data.properties.action_link;
        const resend = new Resend(this.context.env.RESEND_API_KEY);

        const response = await resend.emails.send({
            from: 'STORE-CHECK <onboarding@resend.dev>',
            to: [email],
            subject: 'Invitation to join Store Check',
            react: InvitationEmail({ actionLink, roleName }),
        });

        if (response.error) throw new Error(response.error.message);

        return response.data;
    }

    async validateInvitation(token: string) {
        type Invitation = {
            email: string;
            roles: { id: string, name: string };
            accepted_at: string | null;
            expires_at: string;
            company_id: string | null;
        };

        const { data, error } = await this.supabase
            .schema('core')
            .from('invitations')
            .select('email, roles!inner(id, name), accepted_at, expires_at, company_id')
            .eq('token', token)
            .maybeSingle()
            .overrideTypes<Invitation>();

        if (error) throw new Error(error.message);

        if (!data) throw new Error('Invitation not found');

        if (data.accepted_at) throw new Error('Invitation already accepted');

        if (data.expires_at < new Date().toISOString()) throw new Error('Invitation expired');

        return {
            email: data.email,
            role_id: data.roles.id,
            role_name: data.roles.name,
            company_id: data.company_id,
            is_new_company: !data.company_id
        };
    }

    async acceptInvitation(payload: AcceptInvitationInput & { userId: string }) {
        const { token, avatarUrl, firstName, lastName, userId } = payload;

        // 1. Validar token
        const invitation = await this.validateInvitation(token);

        const email = invitation.email;

        if (!userId) throw new Error('User not found');

        // 3. Crear Profile (Upsert para manejar ambos casos) y 4. Asignar Rol
        const { error: profileError } = await this.supabase.schema('core').from('profiles')
            .upsert({
                id: userId,
                email,
                first_name: firstName,
                last_name: lastName,
                company_id: invitation.company_id, // Asignar compañía si existe en invitación
                avatar_url: avatarUrl
            });

        if (profileError) throw new Error(profileError.message);

        // 5. Update invitations set accepted_at = now()
        const accepted_at = new Date().toISOString();
        await this.supabase
            .schema('core')
            .from('invitations')
            .update({ accepted_at })
            .eq('token', token);

        return {
            acceptedAt: accepted_at,
            invitationStatus: 'accepted'
        }
    }
}
