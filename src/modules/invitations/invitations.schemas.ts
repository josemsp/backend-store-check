import z from "zod";

export const InviteUserAPISchema = z.object({
    email: z.string().email(),
    ownerId: z.string().uuid(),
    branchId: z.string().uuid().optional(),
    name: z.string(),
    phone: z.string().optional(),
    role: z.enum(['owner', 'manager', 'warehouse', 'branch_staff']).default('branch_staff'),
});

export const InviteUserDBSchema = InviteUserAPISchema.transform((data) => ({
    email: data.email,
    owner_id: data.ownerId,
    branch_id: data.branchId || null,
    name: data.name,
    phone: data.phone || null,
    role: data.role,
}));

export const AcceptInvitationAPISchema = z.object({
    token: z.string(),
    avatarUrl: z.string().optional(),
});

export const AcceptInvitationAPISchemaResponse = z.object({
    acceptedAt: z.date(),
    invitationStatus: z.string(),
});
