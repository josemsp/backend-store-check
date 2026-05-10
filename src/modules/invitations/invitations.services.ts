import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../../shared/supabase/types";
import { Context } from "hono";
import { AppContext } from "../../shared/supabase/general";
import { Resend } from "resend";
import { InvitationEmail } from "../../infra/email/templates/Invitation";
import { InviteUserInput } from "./invitations.types";

export class InvitationsService {
    constructor(private supabase: SupabaseClient<Database>, private context: Context<AppContext>) { }

    async createInvitation({ redirectTo, userData }: { redirectTo?: string, userData: InviteUserInput }) {
        const { email, ownerId, name, role, branchId, phone } = userData;

        const token = crypto.randomUUID();
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

        const { error: insertError } = await this.supabase
            .from('invitations')
            .insert({
                email,
                owner_id: ownerId,
                branch_id: branchId || null,
                role,
                invited_by: null,
                token,
                status: 'pending',
                is_system_invite: false,
                expires_at: expiresAt,
            } as Database['public']['Tables']['invitations']['Insert']);

        if (insertError) throw new Error(insertError.message);

        const { data, error } = await this.supabase.auth.admin.generateLink({
            type: 'magiclink',
            email,
            options: {
                redirectTo,
                data: {
                    owner_id: ownerId,
                    name,
                    role
                }
            }
        });

        if (error) throw new Error(error.message);

        const actionLink = data.properties.action_link;
        const resend = new Resend(this.context.env.RESEND_API_KEY);

        const response = await resend.emails.send({
            from: 'STORE-CHECK <onboarding@resend.dev>',
            to: [email],
            subject: 'Invitation to join Store Check',
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            react: InvitationEmail({ actionLink, roleName: role as any }),
        });

        if (response.error) throw new Error(response.error.message);

        return response.data;
    }

    async acceptInvitation(payload: { userId: string; email: string; ownerId: string; name: string; role: Database['public']['Enums']['user_role']; branchId?: string | null; phone?: string | null; avatarUrl?: string | null }) {
        const { userId, email, ownerId, name, role, branchId, phone, avatarUrl } = payload;

        const { data: invitation, error: invitationError } = await this.supabase
            .from('invitations')
            .select('*')
            .eq('email', email)
            .eq('owner_id', ownerId)
            .eq('status', 'pending')
            .single();

        if (invitationError || !invitation) {
            throw new Error('No pending invitation found');
        }

        if (invitation.expires_at && new Date(invitation.expires_at) < new Date()) {
            await this.supabase
                .from('invitations')
                .update({ status: 'expired' })
                .eq('id', invitation.id);
            throw new Error('Invitation has expired');
        }

        const { error: profileError } = await this.supabase
            .from('user_profiles')
            .upsert({
                id: userId,
                owner_id: ownerId,
                name,
                role,
                branch_id: branchId || null,
                phone: phone || null,
                avatar_url: avatarUrl || null,
                is_active: true,
            });

        if (profileError) throw new Error(profileError.message);

        await this.supabase
            .from('invitations')
            .update({ status: 'accepted' })
            .eq('id', invitation.id);

        return {
            acceptedAt: new Date(),
            invitationStatus: 'accepted'
        }
    }
}
