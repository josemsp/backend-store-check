import { z } from 'zod';
import { RoleEnum } from '../users/users.schemas';

export const CompanyInfoSchema = z.object({
	company_name: z.string().min(1, 'El nombre es obligatorio'),
	logo_url: z.string().url().optional(),
});

export const ProfileInfoSchema = z.object({
	name: z.string().min(1, 'El nombre es obligatorio'),
	role: RoleEnum,
	branch_id: z.string().uuid().optional(),
});

export const PreferencesSchema = z.object({
	email_notifications: z.boolean().default(true),
	product_updates: z.boolean().default(true),
	weekly_report: z.boolean().default(true),
	theme: z.enum(['light', 'dark', 'auto']).default('light'),
});

export const OnboardingStatusSchema = z.object({
	company_completed: z.boolean(),
	profile_completed: z.boolean(),
	preferences_completed: z.boolean(),
	onboarding_completed: z.boolean(),
});

export const OnboardingStatusResponseSchema = z.object({
	success: z.literal(true),
	message: z.string().optional(),
	data: OnboardingStatusSchema,
	meta: z.object({ timestamp: z.string() }),
});
