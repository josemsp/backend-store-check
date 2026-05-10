import { BranchesService } from './branches.services';
import { Context } from 'hono';
import { BaseController } from '../../shared/utils/base.controller';
import { successResponse } from '../../shared/utils/response';
import {
	GetBranchSchema,
	ListBranchesSchema,
	UpdateBranchAPIParamsSchema,
	UpdateBranchAPISchema,
	BranchAPISchema,
	BranchListAPISchema,
	CreateBranchAPISchema,
	CreateBranchDBSchema,
} from './branches.schemas';
import { AppContext } from '../../shared/supabase/general';
import z from 'zod';

export class GetBranchController extends BaseController {
	schema = {
		tags: ['Branches'],
		summary: 'Get a branch',
		operationId: 'getBranch',
		security: [{ bearerAuth: [] }],
		request: {
			params: GetBranchSchema,
		},
		responses: this.createStandardResponses(BranchAPISchema, {
			successDescription: 'Branch retrieved successfully',
			includeAuth: true,
			include404: true,
		}),
	};

	async handle(c: Context<AppContext>) {
		const service = new BranchesService(c.get('supabase'));
		const data = await this.getValidatedData<typeof this.schema>();
		const branch = await service.getOne(data.params.id);

		if (!branch) {
			return c.json({ error: 'Branch not found' }, 404);
		}

		return successResponse(c, branch);
	}
}

export class ListBranchesController extends BaseController {
	schema = {
		tags: ['Branches'],
		summary: 'List branches',
		operationId: 'listBranches',
		security: [{ bearerAuth: [] }],
		request: {
			query: ListBranchesSchema,
		},
		responses: this.createStandardResponses(BranchAPISchema, {
			successDescription: 'Branches retrieved',
			include400: true,
			includeAuth: true,
		}),
	};

	async handle(c: Context<AppContext>) {
		const service = new BranchesService(c.get('supabase'));
		const data = await this.getValidatedData<typeof this.schema>();
		const result = await service.list(data.query);
		return successResponse(c, { data: result.data, meta: result.meta });
	}
}

export class CreateBranchController extends BaseController {
	schema = {
		tags: ['Branches'],
		summary: 'Create a branch',
		operationId: 'createBranch',
		security: [{ bearerAuth: [] }],
		request: {
			body: this.createBodySchema(CreateBranchAPISchema),
		},
		responses: this.createStandardResponses(BranchAPISchema, {
			successDescription: 'Branch created',
			include400: true,
			includeAuth: true,
		}),
	};

	async handle(c: Context<AppContext>) {
		const data = await this.getValidatedData<typeof this.schema>();
		const payload = CreateBranchDBSchema.parse(data.body);
		const service = new BranchesService(c.get('supabase'));
		const result = await service.create(payload);
		return successResponse(c, result, 'Branch created');
	}
}

export class UpdateBranchController extends BaseController {
	schema = {
		tags: ['Branches'],
		summary: 'Update a branch',
		operationId: 'updateBranch',
		security: [{ bearerAuth: [] }],
		request: {
			params: UpdateBranchAPIParamsSchema,
			body: this.createBodySchema(UpdateBranchAPISchema),
		},
		responses: this.createStandardResponses(BranchAPISchema, {
			successDescription: 'Branch updated',
			include400: true,
			includeAuth: true,
			include404: true,
		}),
	};

	async handle(c: Context<AppContext>) {
		const data = await this.getValidatedData<typeof this.schema>();
		const service = new BranchesService(c.get('supabase'));

		const updatePayload: any = {};
		if (data.body.name !== undefined) updatePayload.name = data.body.name;
		if (data.body.type !== undefined) updatePayload.type = data.body.type;
		if (data.body.address !== undefined) updatePayload.address = data.body.address;
		if (data.body.phone !== undefined) updatePayload.phone = data.body.phone;
		if (data.body.latitude !== undefined) updatePayload.latitude = data.body.latitude;
		if (data.body.longitude !== undefined) updatePayload.longitude = data.body.longitude;
		if (data.body.isActive !== undefined) updatePayload.is_active = data.body.isActive;

		const result = await service.update(data.params.id, updatePayload);
		return successResponse(c, result, 'Branch updated');
	}
}

export class DeleteBranchController extends BaseController {
	schema = {
		tags: ['Branches'],
		summary: 'Delete a branch',
		operationId: 'deleteBranch',
		security: [{ bearerAuth: [] }],
		request: {
			params: GetBranchSchema,
		},
		responses: this.createStandardResponses(z.void(), {
			successDescription: 'Branch deleted',
			includeAuth: true,
			include404: true,
		}),
	};

	async handle(c: Context<AppContext>) {
		const service = new BranchesService(c.get('supabase'));
		const data = await this.getValidatedData<typeof this.schema>();
		await service.delete(data.params.id);
		return successResponse(c, undefined, 'Branch deleted');
	}
}
