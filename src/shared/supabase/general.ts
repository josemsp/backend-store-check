import { SupabaseClient, User } from "@supabase/supabase-js";
import { Database } from "./types";

export interface Bindings {
    SUPABASE_URL: string;
    SUPABASE_ANON_KEY: string;
    SUPABASE_SERVICE_ROLE_KEY: string;
}

export interface Variables {
    user?: User;
    profile?: Partial<Database['core']['Tables']['profiles']['Row']>;
    supabase: SupabaseClient;
}

export type AppContext = {
    Bindings: Bindings;
    Variables: Variables;
}
