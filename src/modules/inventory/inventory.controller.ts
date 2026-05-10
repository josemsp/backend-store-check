import { InventoryService } from './inventory.services';
import { Context } from 'hono';
import { BaseController } from '../../shared/utils/base.controller';
import { successResponse } from '../../shared/utils/response';
import {
	GetInventorySchema,
	ListInventorySchema,
	UpdateInventoryAPIParamsSchema,
	UpdateInventoryAPISchema,
	InventoryAPISchema,
	InventoryListAPISchema,
	CreateInventoryAPISchema,
	CreateInventoryDBSchema,
} from './inventory.schemas';
import { AppContext } from '../../shared/supabase/general';
import z from 'zod';

export class GetInventoryController extends BaseController {
	schema = {
		tags: ['Inventory'],
		summary: 'Get inventory item',
		operationId: 'getInventory',
		security: [{ bearerAuth: [] }],
		request: {
			params: GetInventorySchema,
		},
		responses: this.createStandardResponses(InventoryAPISchema, {
			successDescription: 'Inventory item retrieved successfully',
			includeAuth: true,
			include404: true,
		}),
	};

	async handle(c: Context<AppContext>) {
		const service = new InventoryService(c.get('supabase'));
		const data = await this.getValidatedData<typeof this.schema>();
		const inventory = await service.getOne(data.params.id);

		if (!inventory) {
			return c.json({ error: 'Inventory item not found' }, 404);
		}

		return successResponse(c, inventory);
	}
}

export class ListInventoryController extends BaseController {
	schema = {
		tags: ['Inventory'],
		summary: 'List inventory items',
		operationId: 'listInventory',
		security: [{ bearerAuth: [] }],
		request: {
			query: ListInventorySchema,
		},
		responses: this.createStandardResponses(InventoryAPISchema, {
			successDescription: 'Inventory items retrieved',
			include400: true,
			includeAuth: true,
		}),
	};

	async handle(c: Context<AppContext>) {
		const service = new InventoryService(c.get('supabase'));
		const data = await this.getValidatedData<typeof this.schema>();
		const result = await service.list(data.query);
		return successResponse(c, { data: result.data, meta: result.meta });
	}
}

export class CreateInventoryController extends BaseController {
	schema = {
		tags: ['Inventory'],
		summary: 'Create inventory item',
		operationId: 'createInventory',
		security: [{ bearerAuth: [] }],
		request: {
			body: this.createBodySchema(CreateInventoryAPISchema),
		},
		responses: this.createStandardResponses(InventoryAPISchema, {
			successDescription: 'Inventory item created',
			include400: true,
			includeAuth: true,
		}),
	};

	async handle(c: Context<AppContext>) {
		const data = await this.getValidatedData<typeof this.schema>();
		const payload = CreateInventoryDBSchema.parse(data.body);
		const service = new InventoryService(c.get('supabase'));
		const result = await service.create(payload);
		return successResponse(c, result, 'Inventory item created');
	}
}

export class UpdateInventoryController extends BaseController {
	schema = {
		tags: ['Inventory'],
		summary: 'Update inventory item',
		operationId: 'updateInventory',
		security: [{ bearerAuth: [] }],
		request: {
			params: UpdateInventoryAPIParamsSchema,
			body: this.createBodySchema(UpdateInventoryAPISchema),
		},
		responses: this.createStandardResponses(InventoryAPISchema, {
			successDescription: 'Inventory item updated',
			include400: true,
			includeAuth: true,
			include404: true,
		}),
	};

	async handle(c: Context<AppContext>) {
		const data = await this.getValidatedData<typeof this.schema>();
		const service = new InventoryService(c.get('supabase'));

		const updatePayload: any = {};
		if (data.body.quantity !== undefined) updatePayload.quantity = data.body.quantity;

		const result = await service.update(data.params.id, updatePayload);
		return successResponse(c, result, 'Inventory item updated');
	}
}

export class DeleteInventoryController extends BaseController {
	schema = {
		tags: ['Inventory'],
		summary: 'Delete inventory item',
		operationId: 'deleteInventory',
		security: [{ bearerAuth: [] }],
		request: {
			params: GetInventorySchema,
		},
		responses: this.createStandardResponses(z.any(), {
			successDescription: 'Inventory item deleted',
			includeAuth: true,
			include404: true,
		}),
	};

	async handle(c: Context<AppContext>) {
		const service = new InventoryService(c.get('supabase'));
		const data = await this.getValidatedData<typeof this.schema>();
		await service.delete(data.params.id);
		return successResponse(c, null, 'Inventory item deleted');
	}
}
