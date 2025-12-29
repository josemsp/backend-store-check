import { contentJson, OpenAPIRoute } from "chanfana";
import { CompaniesService } from "./companies.service";
import z from "zod";
import { CompanySchema, CreateCompanySchema, UpdateCompanySchema, ListCompaniesSchema } from "./companies.validators";
import { Context } from "hono";
import { AppContext } from "../../shared/supabase";
import { createAnonClient } from "../../infra/supabase/anon.client";

export class GetCompanyController extends OpenAPIRoute {
    schema = {
        tags: ['Companies'],
        summary: 'Get a company',
        responses: {
            '200': {
                description: 'Company success',
                ...contentJson(CompanySchema),
            },
            '404': {
                description: 'Company not found',
                ...contentJson({
                    error: z.string(),
                }),
            },
        },
    }

    async handle(c: Context<AppContext>) {
        const service = new CompaniesService(createAnonClient(c.env, {
            global: {
                headers: {
                    Authorization: c.req.header('Authorization')!
                }
            }
        }));
        const company = await service.getOne(c.req.param('id'));
        return c.json(company, 200);
    }
}

export class ListCompaniesController extends OpenAPIRoute {
    schema = {
        tags: ['Companies'],
        summary: 'Get all companies',
        request: {
            query: ListCompaniesSchema,
        },
        responses: {
            '200': {
                description: 'List of companies success',
                ...contentJson(
                    z.object({
                        data: z.array(CompanySchema),
                        meta: z.object({
                            page: z.number(),
                            pageSize: z.number(),
                            total: z.number(),
                            totalPages: z.number(),
                        })
                    })
                ),
            },
        },
    }

    async handle(c: Context<AppContext>) {
        const data = await this.getValidatedData<typeof this.schema>();
        const service = new CompaniesService(createAnonClient(c.env, {
            global: {
                headers: {
                    Authorization: c.req.header('Authorization')!
                }
            }
        }));
        const result = await service.list(data.query);
        return c.json(result, 200);
    }
}

export class CreateCompanyController extends OpenAPIRoute {
    schema = {
        tags: ['Companies'],
        summary: 'Create a new company',
        request: {
            body: contentJson(CreateCompanySchema),
        },
        responses: {
            '201': {
                description: 'Company created',
                ...contentJson(CompanySchema),
            },
            '400': {
                description: 'Company not created',
                ...contentJson({
                    error: z.string(),
                }),
            },
        },
    }

    async handle(c: Context<AppContext>) {
        const data = await this.getValidatedData<typeof this.schema>();
        const service = new CompaniesService(createAnonClient(c.env, {
            global: {
                headers: {
                    Authorization: c.req.header('Authorization')!
                }
            }
        }));
        const result = await service.create(data.body);
        return c.json(result, 201);
    }
}

export class UpdateCompanyController extends OpenAPIRoute {
    schema = {
        tags: ['Companies'],
        summary: 'Update a company',
        request: {
            body: contentJson(UpdateCompanySchema),
        },
        responses: {
            '200': {
                description: 'Company updated',
                ...contentJson(CompanySchema),
            },
            '404': {
                description: 'Company not found',
                ...contentJson({
                    error: z.string(),
                }),
            },
        },
    }

    async handle(c: Context<AppContext>) {
        const data = await this.getValidatedData<typeof this.schema>();
        const service = new CompaniesService(createAnonClient(c.env, {
            global: {
                headers: {
                    Authorization: c.req.header('Authorization')!
                }
            }
        }));
        const result = await service.update(c.req.param('id'), data.body);
        return c.json(result, 200);
    }
}

export class DeleteCompanyController extends OpenAPIRoute {
    schema = {
        tags: ['Companies'],
        summary: 'Delete a company',
        responses: {
            '200': {
                description: 'Company deleted',
                ...contentJson(z.boolean()),
            },
            '404': {
                description: 'Company not found',
                ...contentJson({
                    error: z.string(),
                }),
            },
        },
    }

    async handle(c: Context<AppContext>) {
        const service = new CompaniesService(createAnonClient(c.env, {
            global: {
                headers: {
                    Authorization: c.req.header('Authorization')!
                }
            }
        }));
        await service.delete(c.req.param('id'));
        return c.json(true, 200);
    }
}
