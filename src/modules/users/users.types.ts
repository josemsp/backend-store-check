import z from "zod";
import {
    ListProfilesSchema,
    ListUserProfilesQuerySchema,
    PaginatedUserProfilesSchema,
    UpdateUserDBSchema,
    UserDBSchema,
    CreateUserAPISchema,
    UserAPISchema,
    CreateUserDBSchema,
} from "./users.schemas";
import { Database } from "../../shared/supabase/types";


export type UserAPI = z.infer<typeof UserAPISchema>;
export type UserDB = z.input<typeof UserDBSchema>;

export type CreateUserInput = z.input<typeof CreateUserAPISchema>;
export type CreateUserDB = z.output<typeof CreateUserDBSchema>;


export type UserTypeZod = z.infer<typeof UserDBSchema>;

export type CreateUserFromZod = Omit<UserTypeZod, 'id' | 'created_at' | 'updated_at'>;

export type CreateUser = z.infer<typeof CreateUserAPISchema>

export type UserProfileData = Database['core']['Views']['v_user_profiles']['Row'];

// Compare UserProfileData with UserFromZod.
const itShouldBeOk = UserDBSchema as z.ZodType<UserProfileData>;

export type UpdateUserFromZod = z.infer<typeof UpdateUserDBSchema>;

export type ListProfilesParams = z.infer<typeof ListProfilesSchema>;

export type ListUserProfilesQuery = z.infer<typeof ListUserProfilesQuerySchema>;

export type PaginatedUserProfiles = z.infer<typeof PaginatedUserProfilesSchema>;

