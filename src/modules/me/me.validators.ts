import { z } from "zod";

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
