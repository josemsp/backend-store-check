import { createClient } from '@supabase/supabase-js';
import { Database } from '../../shared/supabase/types';
import { Bindings } from '../../shared/supabase/general';

export function createAdminClient(env: Bindings) {
    return createClient<Database>(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
}
