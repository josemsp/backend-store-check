import { OwnersService } from './owners.services';
import { Context } from 'hono';
import { BaseController } from '../../shared/utils/base.controller';
import { notFoundError, successPaginatedResponse, successResponse } from '../../shared/utils/response';
import {
	GetOwnerSchema,
	ListOwnersSchema,
	UpdateOwnerAPIParamsSchema,
	CreateOwnerAPISchema,
	OwnerListResponseSchema,
	OwnerResponseSchema,
	UpdateOwnerAPISchema,
} from './owners.schemas';
import { AppContext } from '../../shared/supabase/general';
import { OwnerUpdateInput } from './owners.types';

export class GetOwnerController extends BaseController {
	schema = {
		tags: ['Owners'],
		summary: 'Get an owner',
		operationId: 'getOwner',
		request: {
			params: GetOwnerSchema,
		},
		responses: this.createStandardResponses(OwnerResponseSchema, {
			successDescription: 'Owner profile retrieved successfully',
			includeAuth: true,
			include404: true,
		}),
	};

	async handle(c: Context<AppContext>) {
		const data = await this.getValidatedData<typeof this.schema>();
		const service = new OwnersService(c.get('supabase'));
		const owner = await service.getOne(data.params.id);

		if (!owner) {
			return notFoundError(c, 'Owner not found');
		}

		return successResponse(c, owner);
	}
}

export class ListOwnersController extends BaseController {
	schema = {
		tags: ['Owners'],
		summary: 'List owners',
		operationId: 'listOwners',
		security: [{ bearerAuth: [] }],
		request: {
			query: ListOwnersSchema,
		},
		responses: this.createStandardResponses(OwnerListResponseSchema, {
			successDescription: 'Owners retrieved',
			include400: true,
			includeAuth: true,
		}),
	};

	async handle(c: Context<AppContext>) {
		const data = await this.getValidatedData<typeof this.schema>();
		const service = new OwnersService(c.get('supabase'));
		const result = await service.list(data.query);
		return successPaginatedResponse(c, result.data, result.meta, 'Owners retrieved successfully');
	}
}

export class CreateOwnerController extends BaseController {
	schema = {
		tags: ['Owners'],
		summary: 'Create an owner',
		operationId: 'createOwner',
		security: [{ bearerAuth: [] }],
		request: {
			body: this.createBodySchema(CreateOwnerAPISchema),
		},
		responses: this.createStandardResponses(OwnerResponseSchema, {
			successDescription: 'Owner created',
			include400: true,
			includeAuth: true,
		}),
	};

	async handle(c: Context<AppContext>) {
		const data = await this.getValidatedData<typeof this.schema>();
		const payload = data.body;
		const service = new OwnersService(c.get('supabase'));
		const result = await service.create(payload);
		return successResponse(c, result);
	}
}

export class UpdateOwnerController extends BaseController {
	schema = {
		tags: ['Owners'],
		summary: 'Update an owner',
		operationId: 'updateOwner',
		request: {
			params: UpdateOwnerAPIParamsSchema,
			body: this.createBodySchema(UpdateOwnerAPISchema),
		},
		responses: this.createStandardResponses(OwnerResponseSchema, {
			successDescription: 'Owner updated',
			include400: true,
			includeAuth: true,
			include404: true,
		}),
	};

	async handle(c: Context<AppContext>) {
		const data = await this.getValidatedData<typeof this.schema>();
		const service = new OwnersService(c.get('supabase'));

		const updatePayload: OwnerUpdateInput = {};
		if (data.body.name !== undefined) updatePayload.name = data.body.name;
		if (data.body.email !== undefined) updatePayload.email = data.body.email;
		if (data.body.phone !== undefined) updatePayload.phone = data.body.phone;
		if (data.body.business_name !== undefined) updatePayload.business_name = data.body.business_name;
		if (data.body.logo_url !== undefined) updatePayload.logo_url = data.body.logo_url;
		if (data.body.is_active !== undefined) updatePayload.is_active = data.body.is_active;

		const result = await service.update(data.params.id, updatePayload);
		return successResponse(c, result, 'Owner updated');
	}
}
