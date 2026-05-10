import { OwnerTransfersService } from './owner-transfers.services';
import { Context } from 'hono';
import { z } from 'zod';
import { mapOwnerTransferDbToApi } from './owner-transfers.transforms';
import { BaseController } from '../../shared/utils/base.controller';
import { successResponse } from '../../shared/utils/response';
import {
	GetOwnerTransferSchema,
	ListOwnerTransfersSchema,
	UpdateOwnerTransferAPIParamsSchema,
	UpdateOwnerTransferAPISchema,
	OwnerTransferAPISchema,
	OwnerTransferListAPISchema,
	CreateOwnerTransferAPISchema,
	CreateOwnerTransferDBSchema,
} from './owner-transfers.schemas';
import { AppContext } from '../../shared/supabase/general';

export class GetOwnerTransferController extends BaseController {
	schema = {
		tags: ['Owner Transfers'],
		summary: 'Get an owner transfer',
		operationId: 'getOwnerTransfer',
		security: [{ bearerAuth: [] }],
		request: {
			params: GetOwnerTransferSchema,
		},
		responses: this.createStandardResponses(OwnerTransferAPISchema, {
			successDescription: 'Owner transfer retrieved successfully',
			includeAuth: true,
			include404: true,
		}),
	};

	async handle(c: Context<AppContext>) {
		const service = new OwnerTransfersService(c.get('supabase'));
		const transfer = await service.getOne(c.req.param('id'));

		if (!transfer) {
			return c.json({ error: 'Owner transfer not found' }, 404);
		}

		return successResponse(c, mapOwnerTransferDbToApi(transfer));
	}
}

export class ListOwnerTransfersController extends BaseController {
	schema = {
		tags: ['Owner Transfers'],
		summary: 'List owner transfers',
		operationId: 'listOwnerTransfers',
		security: [{ bearerAuth: [] }],
		request: {
			query: ListOwnerTransfersSchema,
		},
		responses: this.createStandardResponses(OwnerTransferAPISchema, {
			successDescription: 'Owner transfers retrieved',
			include400: true,
			includeAuth: true,
		}),
	};

	async handle(c: Context<AppContext>) {
		const service = new OwnerTransfersService(c.get('supabase'));
		const query = c.req.valid('query');
		const result = await service.list(query);
		const mappedData = result.data.map((t) => mapOwnerTransferDbToApi(t));
		return successResponse(c, { data: mappedData, meta: result.meta });
	}
}

export class CreateOwnerTransferController extends BaseController {
	schema = {
		tags: ['Owner Transfers'],
		summary: 'Create an owner transfer',
		operationId: 'createOwnerTransfer',
		security: [{ bearerAuth: [] }],
		request: {
			body: this.createBodySchema(CreateOwnerTransferAPISchema),
		},
		responses: this.createStandardResponses(OwnerTransferAPISchema, {
			successDescription: 'Owner transfer created',
			include400: true,
			includeAuth: true,
		}),
	};

	async handle(c: Context<AppContext>) {
		const data = await this.getValidatedData<typeof this.schema>();
		const payload = CreateOwnerTransferDBSchema.parse(data.body);
		const service = new OwnerTransfersService(c.get('supabase'));
		const result = await service.create(payload);
		return successResponse(c, mapOwnerTransferDbToApi(result), 'Owner transfer created');
	}
}

export class UpdateOwnerTransferController extends BaseController {
	schema = {
		tags: ['Owner Transfers'],
		summary: 'Update an owner transfer',
		operationId: 'updateOwnerTransfer',
		security: [{ bearerAuth: [] }],
		request: {
			params: UpdateOwnerTransferAPIParamsSchema,
			body: this.createBodySchema(UpdateOwnerTransferAPISchema),
		},
		responses: this.createStandardResponses(OwnerTransferAPISchema, {
			successDescription: 'Owner transfer updated',
			include400: true,
			includeAuth: true,
			include404: true,
		}),
	};

	async handle(c: Context<AppContext>) {
		const data = await this.getValidatedData<typeof this.schema>();
		const service = new OwnerTransfersService(c.get('supabase'));

		const updatePayload: any = {};
		if (data.body.status !== undefined) updatePayload.status = data.body.status;
		if (data.body.agreedPrice !== undefined) updatePayload.agreed_price = data.body.agreedPrice;
		if (data.body.notes !== undefined) updatePayload.notes = data.body.notes;
		if (data.body.currency !== undefined) updatePayload.currency = data.body.currency;

		const result = await service.update(data.params.id, updatePayload);
		return successResponse(c, mapOwnerTransferDbToApi(result), 'Owner transfer updated');
	}
}

export class SendOwnerTransferController extends BaseController {
	schema = {
		tags: ['Owner Transfers'],
		summary: 'Send an owner transfer',
		operationId: 'sendOwnerTransfer',
		security: [{ bearerAuth: [] }],
		request: {
			params: GetOwnerTransferSchema,
		},
		responses: this.createStandardResponses(OwnerTransferAPISchema, {
			successDescription: 'Owner transfer sent',
			includeAuth: true,
			include404: true,
		}),
	};

	async handle(c: Context<AppContext>) {
		const service = new OwnerTransfersService(c.get('supabase'));
		const result = await service.send(c.req.param('id'));
		return successResponse(c, mapOwnerTransferDbToApi(result), 'Owner transfer sent');
	}
}

export class ReceiveOwnerTransferController extends BaseController {
	schema = {
		tags: ['Owner Transfers'],
		summary: 'Receive an owner transfer',
		operationId: 'receiveOwnerTransfer',
		security: [{ bearerAuth: [] }],
		request: {
			params: GetOwnerTransferSchema,
			body: this.createBodySchema(z.object({
				receivedBy: z.uuid(),
			})),
		},
		responses: this.createStandardResponses(OwnerTransferAPISchema, {
			successDescription: 'Owner transfer received',
			include400: true,
			includeAuth: true,
			include404: true,
		}),
	};

	async handle(c: Context<AppContext>) {
		const data = await this.getValidatedData<typeof this.schema>();
		const service = new OwnerTransfersService(c.get('supabase'));
		const result = await service.receive(data.params.id, data.body.receivedBy);
		return successResponse(c, mapOwnerTransferDbToApi(result), 'Owner transfer received');
	}
}

export class CancelOwnerTransferController extends BaseController {
	schema = {
		tags: ['Owner Transfers'],
		summary: 'Cancel an owner transfer',
		operationId: 'cancelOwnerTransfer',
		security: [{ bearerAuth: [] }],
		request: {
			params: GetOwnerTransferSchema,
		},
		responses: this.createStandardResponses(OwnerTransferAPISchema, {
			successDescription: 'Owner transfer cancelled',
			includeAuth: true,
			include404: true,
		}),
	};

	async handle(c: Context<AppContext>) {
		const service = new OwnerTransfersService(c.get('supabase'));
		const result = await service.cancel(c.req.param('id'));
		return successResponse(c, mapOwnerTransferDbToApi(result), 'Owner transfer cancelled');
	}
}

export class DeleteOwnerTransferController extends BaseController {
	schema = {
		tags: ['Owner Transfers'],
		summary: 'Delete an owner transfer',
		operationId: 'deleteOwnerTransfer',
		security: [{ bearerAuth: [] }],
		request: {
			params: GetOwnerTransferSchema,
		},
		responses: this.createStandardResponses(null, {
			successDescription: 'Owner transfer deleted',
			includeAuth: true,
			include404: true,
		}),
	};

	async handle(c: Context<AppContext>) {
		const service = new OwnerTransfersService(c.get('supabase'));
		await service.delete(c.req.param('id'));
		return successResponse(c, null, 'Owner transfer deleted');
	}
}
