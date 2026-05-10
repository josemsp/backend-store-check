import { Context } from 'hono';
import z from 'zod';
import { BaseController } from '../../shared/utils/base.controller';
import { ProductsService } from './products.service';
import { successResponse, serverError } from '../../shared/utils/response';
import { AppContext } from '../../shared/supabase/general';
import { CreateProductSchema, ProductSchema, ListProductsSchema, UpdateProductSchema } from './products.validators';

export class ListProductsController extends BaseController {
    schema = {
        tags: ['Products'],
        summary: 'List all products',
        operationId: 'listProducts',
        security: [{ bearerAuth: [] }],
        request: {
            query: ListProductsSchema,
        },
        responses: this.createStandardResponses(ProductSchema, {
            successDescription: 'List of products',
            includeAuth: true,
        }),
    }

    async handle(c: Context<AppContext>) {
        try {
            const query = c.req.valid('query');
            const service = new ProductsService(c.get('supabase'));
            const result = await service.list(query);
            return successResponse(c, { data: result.data, meta: result.meta });
        } catch (error) {
            return serverError(c, error);
        }
    }
}

export class GetProductController extends BaseController {
    schema = {
        tags: ['Products'],
        summary: 'Get a product',
        operationId: 'getProduct',
        security: [{ bearerAuth: [] }],
        request: {
            params: z.object({ id: z.string().uuid() }),
        },
        responses: this.createStandardResponses(ProductSchema, {
            successDescription: 'Product retrieved',
            includeAuth: true,
            include404: true,
        }),
    }

    async handle(c: Context<AppContext>) {
        try {
            const service = new ProductsService(c.get('supabase'));
            const product = await service.getOne(c.req.param('id'));
            if (!product) {
                return c.json({ error: 'Product not found' }, 404);
            }
            return successResponse(c, product);
        } catch (error) {
            return serverError(c, error);
        }
    }
}

export class CreateProductController extends BaseController {
    schema = {
        tags: ['Products'],
        summary: 'Create a new product',
        operationId: 'createProduct',
        security: [{ bearerAuth: [] }],
        request: {
            body: this.createBodySchema(CreateProductSchema),
        },
        responses: this.createStandardResponses(ProductSchema, {
            successDescription: 'Product created',
            includeAuth: true,
            include400: true,
        }),
    }

    async handle(c: Context<AppContext>) {
        try {
            const data = await this.getValidatedData<typeof this.schema>();
            const service = new ProductsService(c.get('supabase'));
            const product = await service.create(data.body);
            return successResponse(c, product, 'Product created');
        } catch (error) {
            return serverError(c, error);
        }
    }
}

export class UpdateProductController extends BaseController {
    schema = {
        tags: ['Products'],
        summary: 'Update a product',
        operationId: 'updateProduct',
        security: [{ bearerAuth: [] }],
        request: {
            params: z.object({ id: z.string().uuid() }),
            body: this.createBodySchema(UpdateProductSchema),
        },
        responses: this.createStandardResponses(ProductSchema, {
            successDescription: 'Product updated',
            includeAuth: true,
            include400: true,
            include404: true,
        }),
    }

    async handle(c: Context<AppContext>) {
        try {
            const data = await this.getValidatedData<typeof this.schema>();
            const service = new ProductsService(c.get('supabase'));
            const product = await service.update(c.req.param('id'), data.body);
            return successResponse(c, product, 'Product updated');
        } catch (error) {
            return serverError(c, error);
        }
    }
}

export class DeleteProductController extends BaseController {
    schema = {
        tags: ['Products'],
        summary: 'Delete a product',
        operationId: 'deleteProduct',
        security: [{ bearerAuth: [] }],
        request: {
            params: z.object({ id: z.string().uuid() }),
        },
        responses: this.createStandardResponses(null, {
            successDescription: 'Product deleted',
            includeAuth: true,
            include404: true,
        }),
    }

    async handle(c: Context<AppContext>) {
        try {
            const service = new ProductsService(c.get('supabase'));
            await service.delete(c.req.param('id'));
            return successResponse(c, null, 'Product deleted');
        } catch (error) {
            return serverError(c, error);
        }
    }
}
