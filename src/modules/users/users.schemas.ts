import { z } from 'zod';

export const UserDBSchema = z.object({
	id: z.uuid(),
	avatar_url: z.string().nullable(),
	branch_id: z.string().nullable(),
	created_at: z.iso.datetime({ offset: true }),
	is_active: z.boolean(),
	name: z.string(),
	owner_id: z.uuid().nullable(),
	role: z.enum(['owner', 'manager', 'warehouse', 'branch_staff']).nullable(),
	updated_at: z.iso.datetime({ offset: true }),
});

export const UserProfileViewSchema = z.object({
	avatar_url: z.string().nullable(),
	branch_id: z.string().nullable(),
	branch_name: z.string().nullable(),
	business_name: z.string().nullable(),
	email: z.email().nullable(),
	is_active: z.boolean().nullable(),
	is_owner: z.boolean().nullable(),
	is_root: z.boolean().nullable(),
	logo_url: z.string().nullable(),
	name: z.string().nullable(),
	owner_id: z.string().nullable(),
	role: z.enum(['owner', 'manager', 'warehouse', 'branch_staff']).nullable(),
	user_id: z.string().nullable(),
});

export const UserResponseSchema = z.object({
	success: z.literal(true),
	message: z.string().optional(),
	data: UserProfileViewSchema,
	meta: z.object({ timestamp: z.string() }),
});

export const UserListResponseSchema = z.object({
	success: z.literal(true),
	message: z.string().optional(),
	data: z.array(UserProfileViewSchema),
	meta: z.object({
		page: z.number(),
		pageSize: z.number(),
		total: z.number(),
		totalPages: z.number(),
		timestamp: z.string(),
	}),
});

export const UpdateUserSchema = z.object({
	avatar_url: z.string().nullable(),
	branch_id: z.string().nullable(),
	email: z.email().nullable(),
	is_active: z.boolean().nullable(),
	name: z.string().nullable(),
	owner_id: z.string().nullable(),
	role: z.enum(['owner', 'manager', 'warehouse', 'branch_staff']).nullable(),
});

export const UserListAPISchema = z.object({
	data: z.array(UserProfileViewSchema),
	meta: z.object({
		page: z.number(),
		page_size: z.number(),
		total: z.number(),
		total_pages: z.number(),
	}),
});

export const GetUserSchema = z.object({
	id: z.uuid(),
});

export const PaginationQuerySchema = z.object({
	page: z.coerce.number().min(1).default(1),
	page_size: z.coerce.number().min(1).max(100).default(10),
	sort_by: z.enum(['created_at', 'updated_at', 'name']).default('created_at'),
	sort_order: z.enum(['asc', 'desc']).default('desc'),
	search: z.string().optional(),
	is_active: z.boolean().optional(),
});
