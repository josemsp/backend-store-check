import { OwnersService } from './owners.services';
import { Context } from 'hono';
import { mapOwnerDbToApi } from './owners.transforms';
import { createAnonClient } from '../../infra/supabase/anon.client';
import { BaseController } from '../../shared/utils/base.controller';
import { serverError, successResponse } from '../../shared/utils/response';
import {
	GetOwnerSchema,
	ListOwnersSchema,
	UpdateOwnerAPIParamsSchema,
	UpdateOwnerAPISchema,
	OwnerAPISchema,
	OwnerListAPISchema,
	CreateOwnerAPISchema,
	CreateOwnerDBSchema,
} from './owners.schemas';
import { AppContext } from '../../shared/supabase/general';

export class GetMeOwnerController extends BaseController {
	schema = {
		tags: ['Owners'],
		summary: 'Get current owner',
		operationId: 'getMeOwner',
		security: [{ bearerAuth: [] }],
		responses: this.createStandardResponses(OwnerAPISchema, {
			successDescription: 'Owner profile retrieved successfully',
			includeAuth: true,
			include404: true,
		}),
	};

	async handle(c: Context<AppContext>) {
		const profile = c.get('profile');
		if (!profile) {
			return c.json({ error: 'Profile not found' }, 404);
		}

		const service = new OwnersService(c.get('supabase'));
		const owner = await service.getOne(profile.ownerId);

		if (!owner) {
			return c.json({ error: 'Owner not found' }, 404);
		}

		return successResponse(c, mapOwnerDbToApi(owner));
	}
}

export class GetOwnerController extends BaseController {
	schema = {
		tags: ['Owners'],
		summary: 'Get an owner',
		operationId: 'getOwner',
		request: {
			params: GetOwnerSchema,
		},
		responses: this.createStandardResponses(OwnerAPISchema, {
			successDescription: 'Owner profile retrieved successfully',
			includeAuth: true,
			include404: true,
		}),
	};

	async handle(c: Context<AppContext>) {
		const service = new OwnersService(c.get('supabase'));
		const owner = await service.getOne(c.req.param('id'));

		if (!owner) {
			return c.json({ error: 'Owner not found' }, 404);
		}

		return successResponse(c, mapOwnerDbToApi(owner));
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
		responses: this.createStandardResponses(OwnerAPISchema, {
			successDescription: 'Owners retrieved',
			include400: true,
			includeAuth: true,
		}),
	};

	async handle(c: Context<AppContext>) {
		const service = new OwnersService(c.get('supabase'));
		const query = c.req.valid('query');
		const result = await service.list(query);
		const mappedData = result.data.map((o) => mapOwnerDbToApi(o));
		return successResponse(c, { data: mappedData, meta: result.meta });
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
		responses: this.createStandardResponses(OwnerAPISchema, {
			successDescription: 'Owner created',
			include400: true,
			includeAuth: true,
		}),
	};

	async handle(c: Context<AppContext>) {
		const data = await this.getValidatedData<typeof this.schema>();
		const payload = CreateOwnerDBSchema.parse(data.body);
		const service = new OwnersService(c.get('supabase'));
		const result = await service.create(payload);
		return successResponse(c, mapOwnerDbToApi(result), 'Owner created');
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
		responses: this.createStandardResponses(OwnerAPISchema, {
			successDescription: 'Owner updated',
			include400: true,
			includeAuth: true,
			include404: true,
		}),
	};

	async handle(c: Context<AppContext>) {
		const data = await this.getValidatedData<typeof this.schema>();
		const service = new OwnersService(c.get('supabase'));

		const updatePayload: any = {};
		if (data.body.name !== undefined) updatePayload.name = data.body.name;
		if (data.body.email !== undefined) updatePayload.email = data.body.email;
		if (data.body.phone !== undefined) updatePayload.phone = data.body.phone;
		if (data.body.businessName !== undefined) updatePayload.business_name = data.body.businessName;
		if (data.body.logoUrl !== undefined) updatePayload.logo_url = data.body.logoUrl;
		if (data.body.isActive !== undefined) updatePayload.is_active = data.body.isActive;

		const result = await service.update(data.params.id, updatePayload);
		return successResponse(c, mapOwnerDbToApi(result), 'Owner updated');
	}
}

export class DeleteOwnerController extends BaseController {
	schema = {
		tags: ['Owners'],
		summary: 'Delete an owner',
		operationId: 'deleteOwner',
		request: {
			params: GetOwnerSchema,
		},
		responses: this.createStandardResponses(null, {
			successDescription: 'Owner deleted',
			includeAuth: true,
			include404: true,
		}),
	};

	async handle(c: Context<AppContext>) {
		const service = new OwnersService(c.get('supabase'));
		await service.delete(c.req.param('id'));
		return successResponse(c, null, 'Owner deleted');
	}
}
