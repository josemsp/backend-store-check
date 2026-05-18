import { z } from 'zod';
import {
	CompanyInfoSchema,
	PreferencesSchema,
	ProfileInfoSchema,
} from './onboarding.schemas';

export type CompanyInfo = z.infer<typeof CompanyInfoSchema>;
export type ProfileInfo = z.infer<typeof ProfileInfoSchema>;
export type Preferences = z.infer<typeof PreferencesSchema>;

export interface OnboardingStatus {
	company_completed: boolean;
	profile_completed: boolean;
	preferences_completed: boolean;
	onboarding_completed: boolean;
}
