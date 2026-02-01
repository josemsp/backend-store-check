import { z } from "zod";
import { UserAPISchema, UserDBSchema } from "./users.schemas";

export function mapUserDbToApi(
    data: z.infer<typeof UserDBSchema>
): z.infer<typeof UserAPISchema> {
    return {
        id: data.id,
        email: data.email,
        firstName: data.first_name,
        lastName: data.last_name,
        fullName: data.full_name,
        avatarUrl: data.avatar_url,
        status: data.status,
        companyId: data.company_id,
        companyName: data.company_name,
        isRoot: data.is_root,
        isOwner: data.is_owner,
        permissions: data.permissions,
        roles: data.roles.map(r => ({
            id: r.id,
            name: r.name,
            description: r.description,
            isSystemRole: r.is_system_role,
        })),
        createdAt: data.created_at,
        updatedAt: data.updated_at,
    };
}
