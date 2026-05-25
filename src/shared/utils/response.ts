import { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { ZodError } from 'zod';
import { ApiResponse } from '../types';
import { ContentfulStatusCode } from 'hono/utils/http-status';
import { AppContext } from '../supabase/general';

export function successResponse<T>(c: Context<AppContext>, data: T, message?: string, status: ContentfulStatusCode = 200): Response {
	const response: ApiResponse<T> = {
		success: true,
		message,
		data,
		meta: {
			timestamp: new Date().toISOString(),
		},
	};

	return c.json(response, status);
}

export function successPaginatedResponse<T>(
	c: Context<AppContext>,
	data: T[],
	meta?: Record<string, any>,
	message?: string,
	status: ContentfulStatusCode = 200,
): Response {
	const response: ApiResponse<T> = {
		success: true,
		message,
		data,
		meta: {
			timestamp: new Date().toISOString(),
			...meta,
		},
	};

	return c.json(response, status);
}

export function errorResponse(
	c: Context<AppContext>,
	code: string,
	message: string,
	status: ContentfulStatusCode = 400,
	details?: any,
): Response {
	const response: ApiResponse = {
		success: false,
		error: {
			code,
			message,
			details,
		},
		meta: {
			timestamp: new Date().toISOString(),
		},
	};

	return c.json(response, status);
}

export function validationError(c: Context<AppContext>, errors: any): Response {
	return errorResponse(c, 'VALIDATION_ERROR', 'Request validation failed', 400, errors);
}

export function notFoundError(c: Context<AppContext>, resource: string): Response {
	return errorResponse(c, 'NOT_FOUND', `${resource} not found`, 404);
}

export function unauthorizedError(c: Context<AppContext>): Response {
	return errorResponse(c, 'UNAUTHORIZED', 'Authentication required', 401);
}

export function forbiddenError(c: Context<AppContext>, message = 'Access denied'): Response {
	return errorResponse(c, 'FORBIDDEN', message, 403);
}

export function serverError(c: Context<AppContext>, error?: any): Response {
	return errorResponse(c, 'INTERNAL_ERROR', 'An internal error occurred', 500, c.env?.ENV === 'dev' ? error : undefined);
}

export function handleControllerError(c: Context<AppContext>, error: unknown): Response {
	if (error instanceof ZodError) {
		return validationError(c, error);
	}
	if (error instanceof HTTPException) {
		return error.getResponse();
	}
	return serverError(c, error);
}
