import { Context } from 'hono';
import { AppContext } from '../../shared/supabase';
import { handleControllerError } from '../../shared/utils/response';

export async function errorMiddleware(err: Error, c: Context<AppContext>) {
	return handleControllerError(c, err);
}
