import { createClient, SupabaseClientOptions } from '@supabase/supabase-js';
import { Bindings } from '../../shared/supabase/general';
import { Database } from '../../shared/supabase/types';

export function createAnonClient(env: Bindings, options?: SupabaseClientOptions<"public"> | undefined) {
    return createClient<Database>(
        env.SUPABASE_URL,
        env.SUPABASE_ANON_KEY,
        options
    );
}
