import { StockAlertsService } from './stock-alerts.services';
import { Context } from 'hono';
import { z } from 'zod';
import { mapStockAlertDbToApi } from './stock-alerts.transforms';
import { BaseController } from '../../shared/utils/base.controller';
import { successResponse } from '../../shared/utils/response';
import {
	GetStockAlertSchema,
	ListStockAlertsSchema,
	UpdateStockAlertAPIParamsSchema,
	UpdateStockAlertAPISchema,
	StockAlertAPISchema,
	StockAlertListAPISchema,
	CreateStockAlertAPISchema,
	CreateStockAlertDBSchema,
} from './stock-alerts.schemas';
import { AppContext } from '../../shared/supabase/general';

export class GetStockAlertController extends BaseController {
	schema = {
		tags: ['Stock Alerts'],
		summary: 'Get a stock alert',
		operationId: 'getStockAlert',
		security: [{ bearerAuth: [] }],
		request: {
			params: GetStockAlertSchema,
		},
		responses: this.createStandardResponses(StockAlertAPISchema, {
			successDescription: 'Stock alert retrieved successfully',
			includeAuth: true,
			include404: true,
		}),
	};

	async handle(c: Context<AppContext>) {
		const service = new StockAlertsService(c.get('supabase'));
		const alert = await service.getOne(c.req.param('id'));

		if (!alert) {
			return c.json({ error: 'Stock alert not found' }, 404);
		}

		return successResponse(c, mapStockAlertDbToApi(alert));
	}
}

export class ListStockAlertsController extends BaseController {
	schema = {
		tags: ['Stock Alerts'],
		summary: 'List stock alerts',
		operationId: 'listStockAlerts',
		security: [{ bearerAuth: [] }],
		request: {
			query: ListStockAlertsSchema,
		},
		responses: this.createStandardResponses(StockAlertAPISchema, {
			successDescription: 'Stock alerts retrieved',
			include400: true,
			includeAuth: true,
		}),
	};

	async handle(c: Context<AppContext>) {
		const service = new StockAlertsService(c.get('supabase'));
		const query = c.req.valid('query');
		const result = await service.list(query);
		const mappedData = result.data.map((a) => mapStockAlertDbToApi(a));
		return successResponse(c, { data: mappedData, meta: result.meta });
	}
}

export class CreateStockAlertController extends BaseController {
	schema = {
		tags: ['Stock Alerts'],
		summary: 'Create a stock alert',
		operationId: 'createStockAlert',
		security: [{ bearerAuth: [] }],
		request: {
			body: this.createBodySchema(CreateStockAlertAPISchema),
		},
		responses: this.createStandardResponses(StockAlertAPISchema, {
			successDescription: 'Stock alert created',
			include400: true,
			includeAuth: true,
		}),
	};

	async handle(c: Context<AppContext>) {
		const data = await this.getValidatedData<typeof this.schema>();
		const payload = CreateStockAlertDBSchema.parse(data.body);
		const service = new StockAlertsService(c.get('supabase'));
		const result = await service.create(payload);
		return successResponse(c, mapStockAlertDbToApi(result), 'Stock alert created');
	}
}

export class UpdateStockAlertController extends BaseController {
	schema = {
		tags: ['Stock Alerts'],
		summary: 'Update a stock alert',
		operationId: 'updateStockAlert',
		security: [{ bearerAuth: [] }],
		request: {
			params: UpdateStockAlertAPIParamsSchema,
			body: this.createBodySchema(UpdateStockAlertAPISchema),
		},
		responses: this.createStandardResponses(StockAlertAPISchema, {
			successDescription: 'Stock alert updated',
			include400: true,
			includeAuth: true,
			include404: true,
		}),
	};

	async handle(c: Context<AppContext>) {
		const data = await this.getValidatedData<typeof this.schema>();
		const service = new StockAlertsService(c.get('supabase'));

		const updatePayload: any = {};
		if (data.body.quantity !== undefined) updatePayload.quantity = data.body.quantity;
		if (data.body.threshold !== undefined) updatePayload.threshold = data.body.threshold;
		if (data.body.status !== undefined) updatePayload.status = data.body.status;

		const result = await service.update(data.params.id, updatePayload);
		return successResponse(c, mapStockAlertDbToApi(result), 'Stock alert updated');
	}
}

export class ResolveStockAlertController extends BaseController {
	schema = {
		tags: ['Stock Alerts'],
		summary: 'Resolve a stock alert',
		operationId: 'resolveStockAlert',
		security: [{ bearerAuth: [] }],
		request: {
			params: GetStockAlertSchema,
			body: this.createBodySchema(z.object({
				resolvedBy: z.uuid(),
			})),
		},
		responses: this.createStandardResponses(StockAlertAPISchema, {
			successDescription: 'Stock alert resolved',
			include400: true,
			includeAuth: true,
			include404: true,
		}),
	};

	async handle(c: Context<AppContext>) {
		const data = await this.getValidatedData<typeof this.schema>();
		const service = new StockAlertsService(c.get('supabase'));
		const result = await service.resolveAlert(data.params.id, data.body.resolvedBy);
		return successResponse(c, mapStockAlertDbToApi(result), 'Stock alert resolved');
	}
}

export class DismissStockAlertController extends BaseController {
	schema = {
		tags: ['Stock Alerts'],
		summary: 'Dismiss a stock alert',
		operationId: 'dismissStockAlert',
		security: [{ bearerAuth: [] }],
		request: {
			params: GetStockAlertSchema,
		},
		responses: this.createStandardResponses(StockAlertAPISchema, {
			successDescription: 'Stock alert dismissed',
			includeAuth: true,
			include404: true,
		}),
	};

	async handle(c: Context<AppContext>) {
		const service = new StockAlertsService(c.get('supabase'));
		const result = await service.dismissAlert(c.req.param('id'));
		return successResponse(c, mapStockAlertDbToApi(result), 'Stock alert dismissed');
	}
}

export class DeleteStockAlertController extends BaseController {
	schema = {
		tags: ['Stock Alerts'],
		summary: 'Delete a stock alert',
		operationId: 'deleteStockAlert',
		security: [{ bearerAuth: [] }],
		request: {
			params: GetStockAlertSchema,
		},
		responses: this.createStandardResponses(null, {
			successDescription: 'Stock alert deleted',
			includeAuth: true,
			include404: true,
		}),
	};

	async handle(c: Context<AppContext>) {
		const service = new StockAlertsService(c.get('supabase'));
		await service.delete(c.req.param('id'));
		return successResponse(c, null, 'Stock alert deleted');
	}
}
