import z from 'zod';
import { PaginationQuerySchema, UserDBSchema, UserProfileViewSchema } from './users.schemas';
import { Database } from '../../shared/supabase';

// Database types
export type UserDB = Database['public']['Tables']['user_profiles']['Row'];
export type UserRoleDB = UserDB['role'];

// View types
export type CurrentUserProfileDB = Database['public']['Views']['v_current_user']['Row'];
export type UserProfileRootDB = Database['public']['Views']['v_users_full']['Row'];
export type UserProfileOwnerDB = Database['public']['Views']['v_company_users']['Row'];

export type UserProfileAPI = z.infer<typeof UserProfileViewSchema>;
export type UserAPI = z.infer<typeof UserDBSchema>;

export type PaginationParams = z.infer<typeof PaginationQuerySchema>;

// Compare UserProfileData with UserFromZod.
const itShouldBeOk = UserProfileViewSchema as z.ZodType<CurrentUserProfileDB>;
