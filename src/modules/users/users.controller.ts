import { OwnerUserService, RootUserService, UserService } from './users.services';
import { Context } from 'hono';
import { BaseController } from '../../shared/utils/base.controller';
import { serverError, successResponse } from '../../shared/utils/response';
import { GetUserSchema, PaginationQuerySchema, UpdateUserSchema, UserListAPISchema, UserProfileViewSchema } from './users.schemas';
import { AppContext } from '../../shared/supabase/general';
import { UserProfileAPI } from './users.types';

export class GetMeController extends BaseController {
	schema = {
		tags: ['Users'],
		summary: 'Get a user',
		operationId: 'getMe',
		security: [{ bearerAuth: [] }],
		responses: this.createStandardResponses(UserProfileViewSchema, {
			successDescription: 'User profile retrieved successfully',
			includeAuth: true,
			include404: true,
		}),
	};

	async handle(c: Context<AppContext>) {
		try {
			let user = c.get('profile');

			if (!user) {
				const service = new UserService(c.get('supabase'));
				user = await service.getMe();
			}

			if (!user) {
				return c.json({ error: 'Profile not found. Complete your registration.' }, 404);
			}

			return successResponse(c, user);
		} catch (error) {
			console.error('GetMe error:', error);
			return serverError(c, error);
		}
	}
}

export class GetUserController extends BaseController {
	schema = {
		tags: ['Users'],
		summary: 'Get a user',
		operationId: 'getUser',
		request: {
			params: GetUserSchema,
		},
		responses: this.createStandardResponses(UserProfileViewSchema, {
			successDescription: 'User profile retrieved successfully',
			includeAuth: true,
			include404: true,
		}),
	};

	async handle(c: Context<AppContext>) {
		const supabase = c.get('supabase');
		const data = await this.getValidatedData<typeof this.schema>();

		let currentUser = c.get('profile');
		if (!currentUser) {
			return c.json({ error: 'Profile not found' }, 404);
		}

		let profile: Partial<UserProfileAPI> | undefined = undefined;
		if (currentUser.is_root) {
			const service = new RootUserService(supabase);
			profile = await service.getUser(data.params.id);
		} else if (currentUser.role === 'owner') {
			const service = new OwnerUserService(supabase);
			profile = await service.getUser(data.params.id);
		}

		if (!profile) {
			return c.json({ error: 'User not found' }, 404);
		}

		return successResponse(c, profile);
	}
}

export class ListUsersController extends BaseController {
	schema = {
		tags: ['Users'],
		summary: 'Get all users',
		operationId: 'listUsers',
		security: [{ bearerAuth: [] }],
		request: {
			params: PaginationQuerySchema,
		},
		responses: this.createStandardResponses(UserProfileViewSchema, {
			successDescription: 'Users retrieved',
			include400: true,
			includeAuth: true,
			include404: true,
		}),
	};

	async handle(c: Context<AppContext>) {
		const supabase = c.get('supabase');
		const data = await this.getValidatedData<typeof this.schema>();

		let currentUser = c.get('profile');
		if (!currentUser) {
			return c.json({ error: 'Profile not found' }, 404);
		}

		let profiles: any;
		if (currentUser.is_root) {
			const service = new RootUserService(supabase);
			profiles = await service.getAll(data.params);
		} else if (currentUser.role === 'owner') {
			const service = new OwnerUserService(supabase);
			profiles = await service.getAll(data.params);
		}

		return successResponse(c, profiles);
	}
}

export class UpdateUserController extends BaseController {
	schema = {
		tags: ['Users'],
		summary: 'Update a user',
		operationId: 'updateUser',
		security: [{ bearerAuth: [] }],
		request: {
			params: GetUserSchema,
			body: this.createBodySchema(UpdateUserSchema),
		},
		responses: this.createStandardResponses(UserProfileViewSchema, {
			successDescription: 'User updated successfully',
			includeAuth: true,
		}),
	};

	async handle(c: Context<AppContext>) {
		const supabase = c.get('supabase');
		const currentUser = c.get('profile');
		const service = new UserService(supabase);
		const data = await this.getValidatedData<typeof this.schema>();

		try {
			await service.update(data.params.id, {
				name: data.body.name ?? undefined,
				role: data.body.role ?? undefined,
				avatar_url: data.body.avatar_url ?? undefined,
				is_active: data.body.is_active ?? undefined,
			});

			// if (data.body.email) {
			// 	await supabase.auth.updateUser({email: data.body.email});
			// }
			let updatedUser: any;
			if (currentUser?.is_root) {
				const serviceRoot = new RootUserService(supabase);
				updatedUser = await serviceRoot.getUser(data.params.id);
			} else if (currentUser?.role === 'owner') {
				const serviceOwner = new OwnerUserService(supabase);
				updatedUser = await serviceOwner.getUser(data.params.id);
			} else {
				updatedUser = await service.getMe();
			}

			return successResponse(c, updatedUser, 'User updated');
		} catch (error) {
			return serverError(c, error);
		}
	}
}
