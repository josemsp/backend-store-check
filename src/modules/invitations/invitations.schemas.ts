import z from "zod";

export const InvitationsDBSchema = z.object({
    email: z.string().email(),
    company_id: z.string().uuid().optional(),
    role_id: z.string().uuid(),
    token: z.string(),
    invited_by: z.string().uuid(),
    expires_at: z.date(),
});


export const InvitationsAPISchema = z.object({
    email: InvitationsDBSchema.shape.email,
    roleId: InvitationsDBSchema.shape.role_id,
    token: InvitationsDBSchema.shape.token,
    invitedBy: InvitationsDBSchema.shape.invited_by,
    companyId: InvitationsDBSchema.shape.company_id,
    expiresAt: InvitationsDBSchema.shape.expires_at,
    roleName: z.string(),
});

// Schemas docs
export const InvitationsOwnerAPISchema = z.object({
    email: z.string().email(),
});

export const InvitationsOwnerAPISchemaResponse = z.object({
    email: InvitationsOwnerAPISchema.shape.email,
});


export const ValidateInvitationAPISchema = z.object({
    token: z.string(),
});

export const ValidateInvitationAPISchemaResponse = z.object({
    email: z.string().email(),
    roleName: z.string(),
    isNewCompany: z.boolean(),
});

export const AcceptInvitationAPISchema = z.object({
    token: z.string(),
    avatarUrl: z.string().optional(),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    companyName: z.string()
});

export const AcceptInvitationAPISchemaResponse = z.object({
    acceptedAt: z.date(),
    invitationStatus: z.string(),
});

