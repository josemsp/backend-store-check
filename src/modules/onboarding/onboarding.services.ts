import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../../shared/supabase/types';
import { CompanyInfo, OnboardingStatus, Preferences, ProfileInfo } from './onboarding.types';

export class OnboardingService {
	constructor(private db: SupabaseClient<Database>) {}

	async updateCompany(ownerId: string, payload: CompanyInfo) {
		const { company_name: business_name, logo_url } = payload;
		const { error } = await this.db
			.from('owners')
			.update({
				business_name: business_name,
				logo_url: logo_url ?? null,
			})
			.eq('id', ownerId);

		if (error) throw new Error(error.message);
	}

	async updateProfile(userId: string, payload: ProfileInfo) {
		const { name, role, branch_id } = payload;
		const { error } = await this.db
			.from('user_profiles')
			.update({
				name: name,
				role: role,
				branch_id: branch_id ?? null,
			})
			.eq('id', userId);

		if (error) throw new Error(error.message);
	}

	async savePreferences(userId: string, payload: Preferences) {
		const { data: existing } = await this.db.from('user_preferences').select('id').eq('user_id', userId).maybeSingle();

		if (existing) {
			const { error } = await this.db.from('user_preferences').update(payload).eq('user_id', userId);

			if (error) throw new Error(error.message);
		} else {
			const { error } = await this.db.from('user_preferences').insert({ user_id: userId, ...payload });

			if (error) throw new Error(error.message);
		}
	}

	async getStatus(ownerId: string | null, profileId: string): Promise<OnboardingStatus> {
		const company_completed = ownerId ? await this.checkCompanyCompleted(ownerId) : false;

		const profile_completed = await this.checkProfileCompleted(profileId);
		const preferences_completed = await this.checkPreferencesCompleted(profileId);

		return {
			company_completed,
			profile_completed,
			preferences_completed,
			onboarding_completed: profile_completed,
		};
	}

	private async checkCompanyCompleted(ownerId: string): Promise<boolean> {
		const { data, error } = await this.db.from('owners').select('business_name, logo_url').eq('id', ownerId).maybeSingle();

		if (error || !data) return false;
		return Boolean(data.business_name);
	}

	private async checkProfileCompleted(userId: string): Promise<boolean> {
		const { data, error } = await this.db.from('user_profiles').select('name, role').eq('id', userId).maybeSingle();

		if (error || !data) return false;
		return Boolean(data.name && data.role);
	}

	private async checkPreferencesCompleted(userId: string): Promise<boolean> {
		const { data } = await this.db.from('user_preferences').select('id').eq('user_id', userId).maybeSingle();

		return Boolean(data);
	}
}
