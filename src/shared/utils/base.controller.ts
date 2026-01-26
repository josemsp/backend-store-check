import { OpenAPIRoute, OpenAPIRouteSchema, contentJson } from "chanfana";
import { z } from "zod";
import { createSuccessResponseSchema, ErrorResponseSchema } from "./response-schemas";

export interface ResponseOptions {
    successDescription?: string;
    includeAuth?: boolean;
    include404?: boolean;
    include400?: boolean;
    customResponses?: OpenAPIRouteSchema['responses'];
}

export abstract class BaseController extends OpenAPIRoute {
    /* -------------------- RESPONSES -------------------- */
    protected createStandardResponses<T extends z.ZodTypeAny>(
        dataSchema: T,
        options: ResponseOptions = {},
    ): OpenAPIRouteSchema['responses'] {
        const {
            successDescription = "Operation successful",
            includeAuth = true,
            include404 = true,
            include400 = false,
            customResponses = {},
        } = options;

        const responses: OpenAPIRouteSchema['responses'] = {
            "200": {
                description: successDescription,
                ...contentJson(createSuccessResponseSchema(dataSchema)),
            },
            "500": {
                description: "Internal server error",
                ...contentJson(ErrorResponseSchema),
            },
        };

        if (include400) {
            responses["400"] = {
                description: "Bad request / validation error",
                ...contentJson(ErrorResponseSchema),
            };
        }

        if (includeAuth) {
            responses["401"] = {
                description: "Unauthorized",
                ...contentJson(ErrorResponseSchema),
            };
        }

        if (include404) {
            responses["404"] = {
                description: "Not found",
                ...contentJson(ErrorResponseSchema),
            };
        }

        return { ...responses, ...customResponses };
    }

    protected createBodySchema<T>(schema: z.ZodType<T>) {
        return contentJson(schema);
    }

    protected createIdParam(description = "UUID") {
        return z.object({
            id: z.string().uuid().describe(description),
        });
    }
}
