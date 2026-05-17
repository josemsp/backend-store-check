import { Context } from 'hono';
import { AppContext } from '../supabase/general';
import { CurrentUserProfileDB } from '../../modules/users/users.types';

export function getProfileFromContext(c: Context<AppContext>): CurrentUserProfileDB {
	const profile = c.get('profile');
	if (!profile) {
		throw new Error('Profile not found');
	}
	return profile;
}
