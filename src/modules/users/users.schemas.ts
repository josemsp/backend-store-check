import { z } from 'zod';

export const RoleEnum = z.enum(['owner', 'manager', 'warehouse', 'branch_staff']);

export const UserDBSchema = z.object({
	id: z.uuid(),
	avatar_url: z.string().nullable(),
	branch_id: z.string().nullable(),
	created_at: z.iso.datetime({ offset: true }),
	is_active: z.boolean(),
	name: z.string(),
	owner_id: z.uuid().nullable(),
	role: RoleEnum.nullable(),
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
	role: RoleEnum.nullable(),
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
	avatar_url: z.string().optional(),
	branch_id: z.string().optional(),
	email: z.email().optional(),
	is_active: z.boolean().optional(),
	name: z.string().optional(),
	owner_id: z.string().optional(),
	role: RoleEnum.optional(),
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

export const SortableUserFieldsEnum = z.enum(['created_at', 'updated_at', 'name']);
export const SortableUserDirectionEnum = z.enum(['asc', 'desc']);

export const PaginationQuerySchema = z.object({
	page: z.coerce.number().min(1).default(1),
	page_size: z.coerce.number().min(1).max(100).default(10),
	sort_by: SortableUserFieldsEnum.default('created_at'),
	sort_order: SortableUserDirectionEnum.default('desc'),
	search: z.string().optional(),
	is_active: z.boolean().optional(),
});
