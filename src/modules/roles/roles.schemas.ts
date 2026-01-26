import z from "zod";

export const RoleDBSchema = z.object({
    id: z.uuid(),
    company_id: z.uuid().optional(),
    name: z.string(),
    is_system_role: z.boolean(),
    description: z.string().optional(),
    created_at: z.iso.datetime(),
    updated_at: z.iso.datetime(),
});

export const RoleAPISchema = z.object({
    id: RoleDBSchema.shape.id,
    companyId: RoleDBSchema.shape.company_id,
    name: RoleDBSchema.shape.name,
    isSystemRole: RoleDBSchema.shape.is_system_role,
    description: RoleDBSchema.shape.description,
    createdAt: RoleDBSchema.shape.created_at,
    updatedAt: RoleDBSchema.shape.updated_at,
});
