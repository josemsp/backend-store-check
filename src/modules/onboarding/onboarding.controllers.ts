import { Context } from 'hono';
import { BaseController } from '../../shared/utils/base.controller';
import { getProfileFromContext } from '../../shared/utils/profile';
import { serverError, successResponse, validationError } from '../../shared/utils/response';
import { AppContext } from '../../shared/supabase/general';
import {
	CompanyInfoSchema,
	OnboardingStatusResponseSchema,
	PreferencesSchema,
	ProfileInfoSchema,
} from './onboarding.schemas';
import { OnboardingService } from './onboarding.services';
import { ZodError } from 'zod';

export class UpdateCompanyController extends BaseController {
	schema = {
		tags: ['Onboarding'],
		summary: 'Update company info during onboarding',
		operationId: 'updateCompany',
		security: [{ BearerAuth: [] }],
		request: {
			body: this.createBodySchema(CompanyInfoSchema),
		},
		responses: this.createNoContentResponse({
			include400: true,
			includeAuth: true,
		}),
	};

	async handle(c: Context<AppContext>) {
		try {
			const data = await this.getValidatedData<typeof this.schema>();
			const profile = getProfileFromContext(c);
			const service = new OnboardingService(c.get('supabase'));

			const ownerId = profile.owner_id!;
			await service.updateCompany(ownerId, data.body);

			return successResponse(c, null, 'Company info updated');
		} catch (error) {
			if (error instanceof ZodError) {
				return validationError(c, error);
			}
			return serverError(c, error);
		}
	}
}

export class UpdateProfileController extends BaseController {
	schema = {
		tags: ['Onboarding'],
		summary: 'Update user profile during onboarding',
		operationId: 'updateProfile',
		security: [{ BearerAuth: [] }],
		request: {
			body: this.createBodySchema(ProfileInfoSchema),
		},
		responses: this.createNoContentResponse({
			include400: true,
			includeAuth: true,
		}),
	};

	async handle(c: Context<AppContext>) {
		try {
			const data = await this.getValidatedData<typeof this.schema>();
			const profile = getProfileFromContext(c);
			const service = new OnboardingService(c.get('supabase'));

			await service.updateProfile(profile.user_id!, data.body);

			return successResponse(c, null, 'Profile updated');
		} catch (error) {
			if (error instanceof ZodError) {
				return validationError(c, error);
			}
			return serverError(c, error);
		}
	}
}

export class UpdatePreferencesController extends BaseController {
	schema = {
		tags: ['Onboarding'],
		summary: 'Save user preferences during onboarding',
		operationId: 'updatePreferences',
		security: [{ BearerAuth: [] }],
		request: {
			body: this.createBodySchema(PreferencesSchema),
		},
		responses: this.createNoContentResponse({
			include400: true,
			includeAuth: true,
		}),
	};

	async handle(c: Context<AppContext>) {
		try {
			const data = await this.getValidatedData<typeof this.schema>();
			const profile = getProfileFromContext(c);
			const service = new OnboardingService(c.get('supabase'));

			await service.savePreferences(profile.user_id!, data.body);

			return successResponse(c, null, 'Preferences saved');
		} catch (error) {
			if (error instanceof ZodError) {
				return validationError(c, error);
			}
			return serverError(c, error);
		}
	}
}

export class GetOnboardingStatusController extends BaseController {
	schema = {
		tags: ['Onboarding'],
		summary: 'Get onboarding completion status',
		operationId: 'getOnboardingStatus',
		security: [{ BearerAuth: [] }],
		responses: this.createStandardResponses(OnboardingStatusResponseSchema, {
			successDescription: 'Onboarding status retrieved',
			includeAuth: true,
		}),
	};

	async handle(c: Context<AppContext>) {
		try {
			const profile = getProfileFromContext(c);
			const service = new OnboardingService(c.get('supabase'));

			const status = await service.getStatus(
				profile.owner_id,
				profile.user_id!,
			);

			return successResponse(c, status, 'Onboarding status retrieved');
		} catch (error) {
			return serverError(c, error);
		}
	}
}
