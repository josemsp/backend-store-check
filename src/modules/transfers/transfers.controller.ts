import { TransfersService } from './transfers.services';
import { Context } from 'hono';
import { z } from 'zod';
import { mapTransferDbToApi } from './transfers.transforms';
import { BaseController } from '../../shared/utils/base.controller';
import { successResponse } from '../../shared/utils/response';
import {
	GetTransferSchema,
	ListTransfersSchema,
	UpdateTransferAPIParamsSchema,
	UpdateTransferAPISchema,
	TransferAPISchema,
	TransferListAPISchema,
	CreateTransferAPISchema,
	CreateTransferDBSchema,
} from './transfers.schemas';
import { AppContext } from '../../shared/supabase/general';

export class GetTransferController extends BaseController {
	schema = {
		tags: ['Transfers'],
		summary: 'Get a transfer',
		operationId: 'getTransfer',
		security: [{ bearerAuth: [] }],
		request: {
			params: GetTransferSchema,
		},
		responses: this.createStandardResponses(TransferAPISchema, {
			successDescription: 'Transfer retrieved successfully',
			includeAuth: true,
			include404: true,
		}),
	};

	async handle(c: Context<AppContext>) {
		const service = new TransfersService(c.get('supabase'));
		const transfer = await service.getOne(c.req.param('id'));

		if (!transfer) {
			return c.json({ error: 'Transfer not found' }, 404);
		}

		return successResponse(c, mapTransferDbToApi(transfer));
	}
}

export class ListTransfersController extends BaseController {
	schema = {
		tags: ['Transfers'],
		summary: 'List transfers',
		operationId: 'listTransfers',
		security: [{ bearerAuth: [] }],
		request: {
			query: ListTransfersSchema,
		},
		responses: this.createStandardResponses(TransferAPISchema, {
			successDescription: 'Transfers retrieved',
			include400: true,
			includeAuth: true,
		}),
	};

	async handle(c: Context<AppContext>) {
		const service = new TransfersService(c.get('supabase'));
		const query = c.req.valid('query');
		const result = await service.list(query);
		const mappedData = result.data.map((t) => mapTransferDbToApi(t));
		return successResponse(c, { data: mappedData, meta: result.meta });
	}
}

export class CreateTransferController extends BaseController {
	schema = {
		tags: ['Transfers'],
		summary: 'Create a transfer',
		operationId: 'createTransfer',
		security: [{ bearerAuth: [] }],
		request: {
			body: this.createBodySchema(CreateTransferAPISchema),
		},
		responses: this.createStandardResponses(TransferAPISchema, {
			successDescription: 'Transfer created',
			include400: true,
			includeAuth: true,
		}),
	};

	async handle(c: Context<AppContext>) {
		const data = await this.getValidatedData<typeof this.schema>();
		const payload = CreateTransferDBSchema.parse(data.body);
		const service = new TransfersService(c.get('supabase'));
		const result = await service.create(payload);
		return successResponse(c, mapTransferDbToApi(result), 'Transfer created');
	}
}

export class UpdateTransferController extends BaseController {
	schema = {
		tags: ['Transfers'],
		summary: 'Update a transfer',
		operationId: 'updateTransfer',
		security: [{ bearerAuth: [] }],
		request: {
			params: UpdateTransferAPIParamsSchema,
			body: this.createBodySchema(UpdateTransferAPISchema),
		},
		responses: this.createStandardResponses(TransferAPISchema, {
			successDescription: 'Transfer updated',
			include400: true,
			includeAuth: true,
			include404: true,
		}),
	};

	async handle(c: Context<AppContext>) {
		const data = await this.getValidatedData<typeof this.schema>();
		const service = new TransfersService(c.get('supabase'));

		const updatePayload: any = {};
		if (data.body.status !== undefined) updatePayload.status = data.body.status;
		if (data.body.notes !== undefined) updatePayload.notes = data.body.notes;

		const result = await service.update(data.params.id, updatePayload);
		return successResponse(c, mapTransferDbToApi(result), 'Transfer updated');
	}
}

export class UpdateTransferStatusController extends BaseController {
	schema = {
		tags: ['Transfers'],
		summary: 'Update transfer status',
		operationId: 'updateTransferStatus',
		security: [{ bearerAuth: [] }],
		request: {
			params: GetTransferSchema,
			body: this.createBodySchema(z.object({
				status: z.enum(['pending', 'sent', 'received', 'cancelled']),
				receivedBy: z.uuid().optional(),
			})),
		},
		responses: this.createStandardResponses(TransferAPISchema, {
			successDescription: 'Transfer status updated',
			include400: true,
			includeAuth: true,
			include404: true,
		}),
	};

	async handle(c: Context<AppContext>) {
		const data = await this.getValidatedData<typeof this.schema>();
		const service = new TransfersService(c.get('supabase'));
		const result = await service.updateStatus(data.params.id, data.body.status, {
			receivedBy: data.body.receivedBy,
		});
		return successResponse(c, mapTransferDbToApi(result), 'Transfer status updated');
	}
}

export class DeleteTransferController extends BaseController {
	schema = {
		tags: ['Transfers'],
		summary: 'Delete a transfer',
		operationId: 'deleteTransfer',
		security: [{ bearerAuth: [] }],
		request: {
			params: GetTransferSchema,
		},
		responses: this.createStandardResponses(null, {
			successDescription: 'Transfer deleted',
			includeAuth: true,
			include404: true,
		}),
	};

	async handle(c: Context<AppContext>) {
		const service = new TransfersService(c.get('supabase'));
		await service.delete(c.req.param('id'));
		return successResponse(c, null, 'Transfer deleted');
	}
}
