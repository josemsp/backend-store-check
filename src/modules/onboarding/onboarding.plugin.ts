import { authMiddleware } from '../../app/middlewares/auth.middleware';
import { WorkerModule } from '../../app/routing/worker.module.registry';
import {
	GetOnboardingStatusController,
	UpdateCompanyController,
	UpdatePreferencesController,
	UpdateProfileController,
} from './onboarding.controllers';

export const onboardingPlugin: WorkerModule = {
	name: 'onboarding',
	basePath: '/api/v1/onboarding',
	middleware: [authMiddleware],
	routes: [
		{ method: 'get', path: '/status', handler: GetOnboardingStatusController },
		{ method: 'put', path: '/company', handler: UpdateCompanyController },
		{ method: 'put', path: '/profile', handler: UpdateProfileController },
		{ method: 'put', path: '/preferences', handler: UpdatePreferencesController },
	],
};
