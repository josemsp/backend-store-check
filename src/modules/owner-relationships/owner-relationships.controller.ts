import { OwnerRelationshipsService } from './owner-relationships.services';
import { Context } from 'hono';
import { z } from 'zod';
import { mapOwnerRelationshipDbToApi } from './owner-relationships.transforms';
import { BaseController } from '../../shared/utils/base.controller';
import { serverError, successResponse } from '../../shared/utils/response';
import {
	GetOwnerRelationshipSchema,
	ListOwnerRelationshipsSchema,
	UpdateOwnerRelationshipAPIParamsSchema,
	UpdateOwnerRelationshipAPISchema,
	OwnerRelationshipAPISchema,
	OwnerRelationshipListAPISchema,
	CreateOwnerRelationshipAPISchema,
	CreateOwnerRelationshipDBSchema,
	RejectOwnerRelationshipSchema,
} from './owner-relationships.schemas';
import { AppContext } from '../../shared/supabase/general';

export class GetOwnerRelationshipController extends BaseController {
	schema = {
		tags: ['Owner Relationships'],
		summary: 'Get an owner relationship',
		operationId: 'getOwnerRelationship',
		security: [{ bearerAuth: [] }],
		request: {
			params: GetOwnerRelationshipSchema,
		},
		responses: this.createStandardResponses(OwnerRelationshipAPISchema, {
			successDescription: 'Owner relationship retrieved successfully',
			includeAuth: true,
			include404: true,
		}),
	};

	async handle(c: Context<AppContext>) {
		const service = new OwnerRelationshipsService(c.get('supabase'));
		const relationship = await service.getOne(c.req.param('id'));

		if (!relationship) {
			return c.json({ error: 'Owner relationship not found' }, 404);
		}

		return successResponse(c, mapOwnerRelationshipDbToApi(relationship));
	}
}

export class ListOwnerRelationshipsController extends BaseController {
	schema = {
		tags: ['Owner Relationships'],
		summary: 'List owner relationships',
		operationId: 'listOwnerRelationships',
		security: [{ bearerAuth: [] }],
		request: {
			query: ListOwnerRelationshipsSchema,
		},
		responses: this.createStandardResponses(OwnerRelationshipAPISchema, {
			successDescription: 'Owner relationships retrieved',
			include400: true,
			includeAuth: true,
		}),
	};

	async handle(c: Context<AppContext>) {
		const service = new OwnerRelationshipsService(c.get('supabase'));
		const query = c.req.valid('query');
		const result = await service.list(query);
		const mappedData = result.data.map((r) => mapOwnerRelationshipDbToApi(r));
		return successResponse(c, { data: mappedData, meta: result.meta });
	}
}

export class CreateOwnerRelationshipController extends BaseController {
	schema = {
		tags: ['Owner Relationships'],
		summary: 'Create an owner relationship',
		operationId: 'createOwnerRelationship',
		security: [{ bearerAuth: [] }],
		request: {
			body: this.createBodySchema(CreateOwnerRelationshipAPISchema),
		},
		responses: this.createNoContentResponse({
			include400: true,
			includeAuth: true,
		}),
	};

	async handle(c: Context<AppContext>) {
		const data = await this.getValidatedData<typeof this.schema>();
		const payload = CreateOwnerRelationshipDBSchema.parse(data.body);
		const service = new OwnerRelationshipsService(c.get('supabase'));
		await service.create(payload);
		return c.body(null, 204);
	}
}

export class UpdateOwnerRelationshipController extends BaseController {
	schema = {
		tags: ['Owner Relationships'],
		summary: 'Update an owner relationship',
		operationId: 'updateOwnerRelationship',
		security: [{ bearerAuth: [] }],
		request: {
			params: UpdateOwnerRelationshipAPIParamsSchema,
			body: this.createBodySchema(UpdateOwnerRelationshipAPISchema),
		},
		responses: this.createStandardResponses(OwnerRelationshipAPISchema, {
			successDescription: 'Owner relationship updated',
			include400: true,
			includeAuth: true,
			include404: true,
		}),
	};

	async handle(c: Context<AppContext>) {
		const data = await this.getValidatedData<typeof this.schema>();
		const service = new OwnerRelationshipsService(c.get('supabase'));

		const updatePayload: any = {};
		if (data.body.status !== undefined) updatePayload.status = data.body.status;
		if (data.body.notes !== undefined) updatePayload.notes = data.body.notes;

		const result = await service.update(data.params.id, updatePayload);
		return successResponse(c, mapOwnerRelationshipDbToApi(result), 'Owner relationship updated');
	}
}

export class ApproveOwnerRelationshipController extends BaseController {
	schema = {
		tags: ['Owner Relationships'],
		summary: 'Approve an owner relationship',
		operationId: 'approveOwnerRelationship',
		security: [{ bearerAuth: [] }],
		request: {
			params: GetOwnerRelationshipSchema,
		},
		responses: this.createStandardResponses(OwnerRelationshipAPISchema, {
			successDescription: 'Owner relationship approved',
			includeAuth: true,
			include404: true,
		}),
	};

	async handle(c: Context<AppContext>) {
		const service = new OwnerRelationshipsService(c.get('supabase'));
		const result = await service.approve(c.req.param('id'));
		return successResponse(c, mapOwnerRelationshipDbToApi(result), 'Owner relationship approved');
	}
}

export class RejectOwnerRelationshipController extends BaseController {
	schema = {
		tags: ['Owner Relationships'],
		summary: 'Reject an owner relationship',
		operationId: 'rejectOwnerRelationship',
		security: [{ bearerAuth: [] }],
		request: {
			params: GetOwnerRelationshipSchema,
			body: this.createBodySchema(z.object({
				notes: z.string().optional(),
			})),
		},
		responses: this.createStandardResponses(OwnerRelationshipAPISchema, {
			successDescription: 'Owner relationship rejected',
			include400: true,
			includeAuth: true,
			include404: true,
		}),
	};

	async handle(c: Context<AppContext>) {
		const data = await this.getValidatedData<typeof this.schema>();
		const service = new OwnerRelationshipsService(c.get('supabase'));
		const result = await service.reject(data.params.id, data.body.notes);
		return successResponse(c, mapOwnerRelationshipDbToApi(result), 'Owner relationship rejected');
	}
}

export class DeleteOwnerRelationshipController extends BaseController {
	schema = {
		tags: ['Owner Relationships'],
		summary: 'Delete an owner relationship',
		operationId: 'deleteOwnerRelationship',
		security: [{ bearerAuth: [] }],
		request: {
			params: GetOwnerRelationshipSchema,
		},
		responses: this.createNoContentResponse({
			includeAuth: true,
			include404: true,
		}),
	};

	async handle(c: Context<AppContext>) {
		const service = new OwnerRelationshipsService(c.get('supabase'));
		await service.delete(c.req.param('id'));
		return c.body(null, 204);
	}
}
