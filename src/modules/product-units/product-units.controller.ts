import { ProductUnitsService } from './product-units.services';
import { Context } from 'hono';
import { mapProductUnitDbToApi } from './product-units.transforms';
import { BaseController } from '../../shared/utils/base.controller';
import { successResponse } from '../../shared/utils/response';
import {
	GetProductUnitSchema,
	ListProductUnitsSchema,
	UpdateProductUnitAPIParamsSchema,
	UpdateProductUnitAPISchema,
	ProductUnitAPISchema,
	ProductUnitListAPISchema,
	CreateProductUnitAPISchema,
	CreateProductUnitDBSchema,
} from './product-units.schemas';
import { AppContext } from '../../shared/supabase/general';

export class GetProductUnitController extends BaseController {
	schema = {
		tags: ['Product Units'],
		summary: 'Get a product unit',
		operationId: 'getProductUnit',
		security: [{ bearerAuth: [] }],
		request: {
			params: GetProductUnitSchema,
		},
		responses: this.createStandardResponses(ProductUnitAPISchema, {
			successDescription: 'Product unit retrieved successfully',
			includeAuth: true,
			include404: true,
		}),
	};

	async handle(c: Context<AppContext>) {
		const service = new ProductUnitsService(c.get('supabase'));
		const unit = await service.getOne(c.req.param('id'));

		if (!unit) {
			return c.json({ error: 'Product unit not found' }, 404);
		}

		return successResponse(c, mapProductUnitDbToApi(unit));
	}
}

export class ListProductUnitsController extends BaseController {
	schema = {
		tags: ['Product Units'],
		summary: 'List product units',
		operationId: 'listProductUnits',
		security: [{ bearerAuth: [] }],
		request: {
			query: ListProductUnitsSchema,
		},
		responses: this.createStandardResponses(ProductUnitAPISchema, {
			successDescription: 'Product units retrieved',
			include400: true,
			includeAuth: true,
		}),
	};

	async handle(c: Context<AppContext>) {
		const service = new ProductUnitsService(c.get('supabase'));
		const query = c.req.valid('query');
		const result = await service.list(query);
		const mappedData = result.data.map((pu) => mapProductUnitDbToApi(pu));
		return successResponse(c, { data: mappedData, meta: result.meta });
	}
}

export class CreateProductUnitController extends BaseController {
	schema = {
		tags: ['Product Units'],
		summary: 'Create a product unit',
		operationId: 'createProductUnit',
		security: [{ bearerAuth: [] }],
		request: {
			body: this.createBodySchema(CreateProductUnitAPISchema),
		},
		responses: this.createStandardResponses(ProductUnitAPISchema, {
			successDescription: 'Product unit created',
			include400: true,
			includeAuth: true,
		}),
	};

	async handle(c: Context<AppContext>) {
		const data = await this.getValidatedData<typeof this.schema>();
		const payload = CreateProductUnitDBSchema.parse(data.body);
		const service = new ProductUnitsService(c.get('supabase'));
		const result = await service.create(payload);
		return successResponse(c, mapProductUnitDbToApi(result), 'Product unit created');
	}
}

export class UpdateProductUnitController extends BaseController {
	schema = {
		tags: ['Product Units'],
		summary: 'Update a product unit',
		operationId: 'updateProductUnit',
		security: [{ bearerAuth: [] }],
		request: {
			params: UpdateProductUnitAPIParamsSchema,
			body: this.createBodySchema(UpdateProductUnitAPISchema),
		},
		responses: this.createStandardResponses(ProductUnitAPISchema, {
			successDescription: 'Product unit updated',
			include400: true,
			includeAuth: true,
			include404: true,
		}),
	};

	async handle(c: Context<AppContext>) {
		const data = await this.getValidatedData<typeof this.schema>();
		const service = new ProductUnitsService(c.get('supabase'));

		const updatePayload: any = {};
		if (data.body.name !== undefined) updatePayload.name = data.body.name;
		if (data.body.label !== undefined) updatePayload.label = data.body.label;
		if (data.body.description !== undefined) updatePayload.description = data.body.description;
		if (data.body.isActive !== undefined) updatePayload.is_active = data.body.isActive;

		const result = await service.update(data.params.id, updatePayload);
		return successResponse(c, mapProductUnitDbToApi(result), 'Product unit updated');
	}
}

export class DeleteProductUnitController extends BaseController {
	schema = {
		tags: ['Product Units'],
		summary: 'Delete a product unit',
		operationId: 'deleteProductUnit',
		security: [{ bearerAuth: [] }],
		request: {
			params: GetProductUnitSchema,
		},
		responses: this.createStandardResponses(null, {
			successDescription: 'Product unit deleted',
			includeAuth: true,
			include404: true,
		}),
	};

	async handle(c: Context<AppContext>) {
		const service = new ProductUnitsService(c.get('supabase'));
		await service.delete(c.req.param('id'));
		return successResponse(c, null, 'Product unit deleted');
	}
}
