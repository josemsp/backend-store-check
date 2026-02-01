import { UsersService } from "./users.services";
import { Context } from "hono";
import { createAnonClient } from "../../infra/supabase/anon.client";
import { BaseController } from "../../shared/utils/base.controller";
import { serverError, successResponse } from "../../shared/utils/response";
import { GetUserSchema, ListProfilesSchema, UserAPISchema } from "./users.schemas";
import { AppContext } from "../../shared/supabase/general";

export class GetMeController extends BaseController {
    schema = {
        tags: ['Users'],
        summary: 'Get a user',
        operationId: 'getMe',
        security: [{ bearerAuth: [] }],
        responses: this.createStandardResponses(
            UserAPISchema,
            {
                successDescription: 'User profile retrieved successfully',
                includeAuth: true,
                include404: true
            }
        ),
    }

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
            params: GetUserSchema
        },
        responses: this.createStandardResponses(
            UserAPISchema,
            {
                successDescription: 'User profile retrieved successfully',
                includeAuth: true,
                include404: true
            }
        )
    }

    async handle(c: Context<AppContext>) {
        const service = new UsersService(createAnonClient(c.env, {
            global: {
                headers: {
                    Authorization: c.req.header('Authorization')!
                }
            }
        }));
        const profile = await service.getOne(c.req.param('id'));

        if (!profile) {
            return c.json({ error: 'User not found' }, 404);
        }
        return c.json(profile, 200);
    }
}

export class ListUsersController extends BaseController {
    schema = {
        tags: ['Users'],
        summary: 'Get all users',
        operationId: 'listUsers',
        security: [{ bearerAuth: [] }],
        request: {
            params: ListProfilesSchema
        },
        responses: this.createStandardResponses(UserAPISchema, {
            successDescription: "Users retrieved",
            include400: true,
            includeAuth: true,
            include404: true
        }),
    }

    async handle(c: Context<AppContext>) {
        const service = new UsersService(createAnonClient(c.env, {
            global: {
                headers: {
                    Authorization: c.req.header('Authorization')!
                }
            }
        }));
        const profiles = await service.getAll();
        return c.json(profiles, 200);
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

