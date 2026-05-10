import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from './types';
import { AuthContext } from '../types';
import { CurrentUserProfileDB } from '../../modules/users/users.types';

export interface Bindings {
	ENV: 'dev' | 'prod';
	SUPABASE_URL: string;
	FRONTEND_URL: string;
	// Secrets
	SUPABASE_ANON_KEY: string;
	SUPABASE_SERVICE_ROLE_KEY: string;
	RESEND_API_KEY: string;
}

export interface Variables {
	authContext?: AuthContext;
	profile?: CurrentUserProfileDB;
	supabase: SupabaseClient<Database>;
}

export type AppContext = {
	Bindings: Bindings;
	Variables: Variables;
};
