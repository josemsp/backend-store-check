import { z } from "zod";

export const UserDBSchema = z.object({
    id: z.uuid(),
    email: z.email(),
    first_name: z.string().nullable(),
    last_name: z.string().nullable(),
    full_name: z.string().nullable(),
    avatar_url: z.string().nullable(),
    status: z.enum(['active', 'inactive', 'deleted']),
    company_id: z.uuid().nullable(),
    company_name: z.string().nullable(),
    is_root: z.boolean(),
    is_owner: z.boolean(),
    permissions: z.array(z.string()),
    roles: z.array(z.object({
        id: z.uuid(),
        name: z.string(),
        description: z.string(),
        is_system_role: z.boolean(),
    })),
    created_at: z.iso.datetime({ offset: true }),
    updated_at: z.iso.datetime({ offset: true }),
});

export const UserAPISchema = z.object({
    id: UserDBSchema.shape.id,
    email: UserDBSchema.shape.email,
    firstName: UserDBSchema.shape.first_name,
    lastName: UserDBSchema.shape.last_name,
    fullName: UserDBSchema.shape.full_name,
    avatarUrl: UserDBSchema.shape.avatar_url,
    status: UserDBSchema.shape.status,
    companyId: UserDBSchema.shape.company_id,
    companyName: UserDBSchema.shape.company_name,
    isRoot: UserDBSchema.shape.is_root,
    isOwner: UserDBSchema.shape.is_owner,
    permissions: UserDBSchema.shape.permissions,
    roles: z.array(z.object({
        id: z.uuid(),
        name: z.string(),
        description: z.string(),
        isSystemRole: z.boolean(),
    })),
    createdAt: UserDBSchema.shape.created_at,
    updatedAt: UserDBSchema.shape.updated_at,
});

export const GetUserSchema = z.object({
    id: z.uuid(),
});

export const CreateUserAPISchema = z.object({
    email: z.email(),
    firstName: z.string().nullable(),
    lastName: z.string().nullable(),
    avatarUrl: z.string().nullable(),
    status: z.enum(['active', 'inactive', 'deleted']).default('active'),
});

export const CreateUserDBSchema = CreateUserAPISchema.transform(data => ({
    email: data.email,
    first_name: data.firstName,
    last_name: data.lastName,
    avatar_url: data.avatarUrl,
    status: data.status,
}));

export const UpdateUserDBSchema = CreateUserAPISchema.partial();

// pagination + filters
export const ListProfilesSchema = z.object({
    page: z.coerce.number().min(1).default(1),
    pageSize: z.coerce.number().min(1).max(100).default(10),

    search: z.string().optional(), // nombre / email
    status: z.enum(["active", "inactive", "deleted"]).optional(),

    fromDate: z.string().optional(), // YYYY-MM-DD
    toDate: z.string().optional(),

    sortBy: z.enum(["created_at", "first_name"]).default("created_at"),
    sortDir: z.enum(["asc", "desc"]).default("desc"),
});

export const PaginationQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    sort_by: z.enum(['created_at', 'updated_at', 'email', 'full_name']).default('created_at'),
    sort_order: z.enum(['asc', 'desc']).default('desc'),
});

export const UserProfileFiltersSchema = z.object({
    status: z.enum(['active', 'inactive', 'suspended']).optional(),
    company_id: z.uuid().optional(),
    is_root: z.coerce.boolean().optional(),
    search: z.string().optional(),
    role_name: z.string().optional(),
    permission_key: z.string().optional(),
});

export const ListUserProfilesQuerySchema = PaginationQuerySchema.merge(UserProfileFiltersSchema);

export const PaginatedUserProfilesSchema = z.object({
    data: z.array(UserDBSchema),
    pagination: z.object({
        page: z.number(),
        limit: z.number(),
        total: z.number(),
        total_pages: z.number(),
        has_next: z.boolean(),
        has_prev: z.boolean(),
    }),
});
