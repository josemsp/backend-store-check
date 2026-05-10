import { ProductCategoriesService } from './product-categories.services';
import { Context } from 'hono';
import { mapProductCategoryDbToApi } from './product-categories.transforms';
import { BaseController } from '../../shared/utils/base.controller';
import { successResponse } from '../../shared/utils/response';
import {
	GetProductCategorySchema,
	ListProductCategoriesSchema,
	UpdateProductCategoryAPIParamsSchema,
	UpdateProductCategoryAPISchema,
	ProductCategoryAPISchema,
	ProductCategoryListAPISchema,
	CreateProductCategoryAPISchema,
	CreateProductCategoryDBSchema,
} from './product-categories.schemas';
import { AppContext } from '../../shared/supabase/general';

export class GetProductCategoryController extends BaseController {
	schema = {
		tags: ['Product Categories'],
		summary: 'Get a product category',
		operationId: 'getProductCategory',
		security: [{ bearerAuth: [] }],
		request: {
			params: GetProductCategorySchema,
		},
		responses: this.createStandardResponses(ProductCategoryAPISchema, {
			successDescription: 'Product category retrieved successfully',
			includeAuth: true,
			include404: true,
		}),
	};

	async handle(c: Context<AppContext>) {
		const service = new ProductCategoriesService(c.get('supabase'));
		const category = await service.getOne(c.req.param('id'));

		if (!category) {
			return c.json({ error: 'Product category not found' }, 404);
		}

		return successResponse(c, mapProductCategoryDbToApi(category));
	}
}

export class ListProductCategoriesController extends BaseController {
	schema = {
		tags: ['Product Categories'],
		summary: 'List product categories',
		operationId: 'listProductCategories',
		security: [{ bearerAuth: [] }],
		request: {
			query: ListProductCategoriesSchema,
		},
		responses: this.createStandardResponses(ProductCategoryAPISchema, {
			successDescription: 'Product categories retrieved',
			include400: true,
			includeAuth: true,
		}),
	};

	async handle(c: Context<AppContext>) {
		const service = new ProductCategoriesService(c.get('supabase'));
		const query = c.req.valid('query');
		const result = await service.list(query);
		const mappedData = result.data.map((pc) => mapProductCategoryDbToApi(pc));
		return successResponse(c, { data: mappedData, meta: result.meta });
	}
}

export class CreateProductCategoryController extends BaseController {
	schema = {
		tags: ['Product Categories'],
		summary: 'Create a product category',
		operationId: 'createProductCategory',
		security: [{ bearerAuth: [] }],
		request: {
			body: this.createBodySchema(CreateProductCategoryAPISchema),
		},
		responses: this.createStandardResponses(ProductCategoryAPISchema, {
			successDescription: 'Product category created',
			include400: true,
			includeAuth: true,
		}),
	};

	async handle(c: Context<AppContext>) {
		const data = await this.getValidatedData<typeof this.schema>();
		const payload = CreateProductCategoryDBSchema.parse(data.body);
		const service = new ProductCategoriesService(c.get('supabase'));
		const result = await service.create(payload);
		return successResponse(c, mapProductCategoryDbToApi(result), 'Product category created');
	}
}

export class UpdateProductCategoryController extends BaseController {
	schema = {
		tags: ['Product Categories'],
		summary: 'Update a product category',
		operationId: 'updateProductCategory',
		security: [{ bearerAuth: [] }],
		request: {
			params: UpdateProductCategoryAPIParamsSchema,
			body: this.createBodySchema(UpdateProductCategoryAPISchema),
		},
		responses: this.createStandardResponses(ProductCategoryAPISchema, {
			successDescription: 'Product category updated',
			include400: true,
			includeAuth: true,
			include404: true,
		}),
	};

	async handle(c: Context<AppContext>) {
		const data = await this.getValidatedData<typeof this.schema>();
		const service = new ProductCategoriesService(c.get('supabase'));

		const updatePayload: any = {};
		if (data.body.name !== undefined) updatePayload.name = data.body.name;
		if (data.body.description !== undefined) updatePayload.description = data.body.description;
		if (data.body.isActive !== undefined) updatePayload.is_active = data.body.isActive;

		const result = await service.update(data.params.id, updatePayload);
		return successResponse(c, mapProductCategoryDbToApi(result), 'Product category updated');
	}
}

export class DeleteProductCategoryController extends BaseController {
	schema = {
		tags: ['Product Categories'],
		summary: 'Delete a product category',
		operationId: 'deleteProductCategory',
		security: [{ bearerAuth: [] }],
		request: {
			params: GetProductCategorySchema,
		},
		responses: this.createStandardResponses(null, {
			successDescription: 'Product category deleted',
			includeAuth: true,
			include404: true,
		}),
	};

	async handle(c: Context<AppContext>) {
		const service = new ProductCategoriesService(c.get('supabase'));
		await service.delete(c.req.param('id'));
		return successResponse(c, null, 'Product category deleted');
	}
}
