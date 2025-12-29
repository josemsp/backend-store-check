import { contentJson, OpenAPIRoute, OpenAPIRouteSchema } from "chanfana";
import { Context } from "hono";
import z from "zod";
import { AppContext } from "../../shared/supabase";
import { ProductsService } from "./products.service";
import { createAnonClient } from "../../infra/supabase/anon.client";
import { CreateProductFromZod, CreateProductSchema, ProductFromZod, ProductSchema } from "./products.validators";

export class ListProductsController extends OpenAPIRoute {
    schema = {
        tags: ['Products'],
        summary: 'List all products',
        responses: {
            '200': {
                description: 'List of products',
                ...contentJson(
                    z.array(ProductSchema)
                )
            },
        },
    }

    async handle(c: Context<AppContext>) {
        const service = new ProductsService(createAnonClient(c.env));
        const products = await service.getAll();
        return c.json(products, 200);
    }
}

export class CreateProductController extends OpenAPIRoute {
    schema = {
        tags: ['Products'],
        summary: 'Create a new product',
        request: {
            body: contentJson(CreateProductSchema),
        },
        responses: {
            '201': {
                description: 'Product created',
                ...contentJson(
                    z.object({
                        success: z.boolean(),
                        data: ProductSchema,
                    })
                ),
            },
        },
    }

    async handle(c: Context<AppContext>) {
        const data = await this.getValidatedData<typeof this.schema>();
        const service = new ProductsService(createAnonClient(c.env));
        const product = await service.create(data.body as unknown as CreateProductFromZod);
        return c.json(product, 201);
    }
}