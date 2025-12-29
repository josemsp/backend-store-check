import { contentJson, OpenAPIRoute } from "chanfana";
import { MeService } from "./me.service";
import z from "zod";
import { UserSchema } from "./me.validators";
import { Context } from "hono";
import { AppContext } from "../../shared/supabase";
import { createAnonClient } from "../../infra/supabase/anon.client";

export class GetMeController extends OpenAPIRoute {
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
        const service = new MeService(createAnonClient(c.env, {
            global: {
                headers: {
                    Authorization: c.req.header('Authorization')!
                }
            }
        }));
        const profile = await service.getMe(c.get('user')?.id!);

        if (!profile) {
            return c.json({ error: 'User not found' }, 404);
        }
        return c.json(profile, 200);
    }
}
