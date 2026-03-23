import { UsersService } from './users.services';
import { Context } from 'hono';
import { mapUserDbToApi } from './users.transforms';
import { createAnonClient } from '../../infra/supabase/anon.client';
import { BaseController } from '../../shared/utils/base.controller';
import { serverError, successResponse } from '../../shared/utils/response';
import {
	GetUserSchema,
	ListProfilesSchema,
	UpdateUserAPIParamsSchema,
	UpdateUserAPISchema,
	UserAPISchema,
	UserListAPISchema,
} from './users.schemas';
import { AppContext } from '../../shared/supabase/general';
import { AssignPermissionAPISchema } from '../permissions/permission.schemas';
import { PermissionService } from '../permissions/permission.services';

export class GetMeController extends BaseController {
	schema = {
		tags: ['Users'],
		summary: 'Get a user',
		operationId: 'getMe',
		security: [{ bearerAuth: [] }],
		responses: this.createStandardResponses(UserAPISchema, {
			successDescription: 'User profile retrieved successfully',
			includeAuth: true,
			include404: true,
		}),
	};

	async handle(c: Context<AppContext>) {
		const user = c.get('profile');

		try {
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
		responses: this.createStandardResponses(UserAPISchema, {
			successDescription: 'User profile retrieved successfully',
			includeAuth: true,
			include404: true,
		}),
	};

	async handle(c: Context<AppContext>) {
		const authHeader = c.req.header('Authorization');
		const service = new UsersService(
			createAnonClient(c.env, {
				accessToken: async () => authHeader?.replace('Bearer ', '') || '',
			}),
		);
		const profile = await service.getOne(c.req.param('id'));

		if (!profile) {
			return c.json({ error: 'User not found' }, 404);
		}

		const mappedProfile = mapUserDbToApi(profile as any);
		return successResponse(c, mappedProfile);
	}
}

export class ListUsersController extends BaseController {
	schema = {
		tags: ['Users'],
		summary: 'Get all users',
		operationId: 'listUsers',
		security: [{ bearerAuth: [] }],
		request: {
			params: ListProfilesSchema,
		},
		responses: this.createStandardResponses(UserListAPISchema, {
			successDescription: 'Users retrieved',
			include400: true,
			includeAuth: true,
			include404: true,
		}),
	};

	async handle(c: Context<AppContext>) {
		const authHeader = c.req.header('Authorization');
		const service = new UsersService(
			createAnonClient(c.env, {
				accessToken: async () => authHeader?.replace('Bearer ', '') || '',
			}),
		);
		const profiles = await service.getAll();
		const mappedProfiles = profiles.map((p: any) => mapUserDbToApi(p));
		return successResponse(c, mappedProfiles);
	}
}

export class UpdateUserController extends BaseController {
	schema = {
		tags: ['Users'],
		summary: 'Update a user',
		operationId: 'updateUser',
		request: {
			params: UpdateUserAPIParamsSchema,
			body: this.createBodySchema(UpdateUserAPISchema),
		},
		responses: this.createStandardResponses(UserAPISchema, {
			successDescription: 'User updated',
			include400: true,
			includeAuth: true,
			include404: true,
		}),
	};

	async handle(c: Context<AppContext>) {
		const authHeader = c.req.header('Authorization');

		if (!authHeader || !authHeader.startsWith('Bearer ')) {
			return c.json({ error: 'Unauthorized' }, 401);
		}

		const supabaseAuth = createAnonClient(c.env);
		const supabaseDb = createAnonClient(c.env, {
			db: {
				schema: 'core',
			},
			global: {
				headers: {
					Authorization: authHeader,
				},
			},
		});
		const service = new UsersService(supabaseDb);

		// validate authenticated user
		const {
			data: { user },
			error: authError,
		} = await supabaseAuth.auth.getUser(authHeader.replace('Bearer ', ''));

		if (authError || !user) {
			return c.json({ error: 'Invalid token' }, 401);
		}

		const data = await this.getValidatedData<typeof this.schema>();
		// only allow update if user is owner or admin
		if (user.id !== data.params.id) {
			return c.json({ error: 'Forbidden' }, 403);
		}

		// Transformar de camelCase a snake_case
		const updatePayload: any = {};
		if (data.body.email) updatePayload.email = data.body.email;
		if (data.body.firstName !== undefined) updatePayload.first_name = data.body.firstName;
		if (data.body.lastName !== undefined) updatePayload.last_name = data.body.lastName;
		if (data.body.avatarUrl !== undefined) updatePayload.avatar_url = data.body.avatarUrl;
		if (data.body.status) updatePayload.status = data.body.status;
		if (data.body.roleId) updatePayload.role_id = data.body.roleId;

		try {
			await service.update(data.params.id, updatePayload);

			// Obtener el usuario actualizado para devolverlo con el rol actualizado
			const updatedUser = await service.getOne(data.params.id);

			if (!updatedUser) {
				return c.json({ error: 'User not found' }, 404);
			}

			const mappedUpdatedUser = mapUserDbToApi(updatedUser as any);
			return successResponse(c, mappedUpdatedUser, 'User updated');
		} catch (error) {
			console.error('UpdateUser error:', error);
			return serverError(c, error);
		}
	}
}

export class AssignUserPermissionsController extends BaseController {
	schema = {
		tags: ['Users'],
		summary: 'Assign permissions to a user',
		operationId: 'assignUserPermissions',
		security: [{ bearerAuth: [] }],
		request: {
			params: UpdateUserAPIParamsSchema,
			body: this.createBodySchema(AssignPermissionAPISchema),
		},
		responses: this.createStandardResponses(UserAPISchema, {
			successDescription: 'User permissions assigned',
			include400: true,
			includeAuth: true,
			include404: true,
		}),
	};

	async handle(c: Context<AppContext>) {
		const authHeader = c.req.header('Authorization');
		const service = new UsersService(
			createAnonClient(c.env, {
				accessToken: async () => authHeader?.replace('Bearer ', '') || '',
			}),
		);
		const servicePermission = new PermissionService(
			createAnonClient(c.env, {
				accessToken: async () => authHeader?.replace('Bearer ', '') || '',
			}),
		);
		const data = await this.getValidatedData<typeof this.schema>();
		await servicePermission.assignPermissions({
			userId: data.params.id,
			permissionKeys: data.body.permissionKeys,
		});
		const profile = await service.getOne(data.params.id);

		const mappedProfile = mapUserDbToApi(profile as any);
		return successResponse(c, mappedProfile, 'User permissions assigned');
	}
}

// export class CreateUserController extends BaseController {
//     schema = {
//         tags: ['Users'],
//         summary: 'Create a new user',
//         security: [{ bearerAuth: [] }],
//         request: {
//             headers: this.authHeader,
//             body: this.createBodySchema(CreateUserAPISchema)
//         },
//         responses: this.createStandardResponses(UserAPISchema, {
//             successDescription: "User created",
//             include400: true,
//             includeAuth: true,
//             include404: true
//         }),
//     }

//     async handle(c: Context<AppContext>) {
//         const data = await this.getValidatedData<typeof this.schema>();
//         const payload = CreateUserDBSchema.parse(data.body)
//         const service = new UsersService(createAnonClient(c.env));
//         const result = await service.create(payload);
//         return c.json(result, 201);
//     }
// }
