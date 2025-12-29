import { contentJson, OpenAPIRoute } from "chanfana";
import { UsersService } from "./users.service";
import z from "zod";
import { CreateUserFromZod, CreateUserSchema, UserSchema } from "./users.validators";
import { Context } from "hono";
import { AppContext } from "../../shared/supabase";
import { createAnonClient } from "../../infra/supabase/anon.client";

export class GetUserController extends OpenAPIRoute {
    schema = {
        tags: ['Users'],
        summary: 'Get a user',
        responses: {
            '200': {
                description: 'User success',
                ...contentJson(UserSchema),
            },
            '404': {
                description: 'User not found',
                ...contentJson({
                    error: z.string(),
                }),
            },
        },
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

export class ListUsersController extends OpenAPIRoute {
    schema = {
        tags: ['Users'],
        summary: 'Get all users',
        responses: {
            '200': {
                description: 'List of users success',
                ...contentJson(
                    z.array(UserSchema)
                ),
            },
        },
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

export class CreateUserController extends OpenAPIRoute {
    schema = {
        tags: ['Users'],
        summary: 'Create a new user',
        request: {
            body: contentJson(CreateUserSchema),
        },
        responses: {
            '201': {
                description: 'User created',
                ...contentJson(
                    z.object({
                        success: z.boolean(),
                        data: UserSchema,
                    })
                ),
            },
            '400': {
                description: 'User not created',
                ...contentJson({
                    error: z.string(),
                }),
            },
        },
    }

    async handle(c: Context<AppContext>) {
        const data = await this.getValidatedData<typeof this.schema>();
        const service = new UsersService(createAnonClient(c.env));
        const result = await service.create(data.body as CreateUserFromZod);
        return c.json(result, 201);
    }
}
