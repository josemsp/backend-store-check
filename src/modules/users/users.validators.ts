import { z } from "zod";
import { Database } from "../../shared/supabase";

type User = Database["core"]["Tables"]["profiles"]["Row"];

export const UserSchema = z.object({
    id: z.string(),
    company_id: z.string(),
    role_id: z.string(),
    email: z.string().email(),
    first_name: z.string(),
    last_name: z.string(),
    full_name: z.string(),
    avatar_url: z.string().url().nullable(),
    status: z.enum(['active', 'inactive', 'deleted']),
    created_at: z.string(),
    updated_at: z.string(),
    deleted_at: z.string().nullable(),
});

export type UserFromZod = z.infer<typeof UserSchema>;

export type CreateUserFromZod = Omit<UserFromZod, 'id' | 'created_at' | 'updated_at'>;

export const CreateUserSchema = UserSchema
    .omit({ id: true, created_at: true, updated_at: true })
    .extend({
        status: z.enum(['active', 'inactive', 'deleted']).default('active'),
    });

export const UpdateUserSchema = CreateUserSchema.partial();

export type UpdateUserFromZod = z.infer<typeof UpdateUserSchema>;

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

export type ListProfilesParams = z.infer<typeof ListProfilesSchema>;

