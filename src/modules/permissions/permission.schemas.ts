import { z } from 'zod';

export const PermissionKeySchema = z.enum([
	'users.read',
	'users.invite',
	'users.update',
	'users.remove',
	'roles.assign',

	'company.create',
	'company.read',
	'company.update',
	'company.delete',

	'branches.create',
	'branches.read',
	'branches.update',
	'branches.delete',

	'shipments.create',
	'shipments.read',
	'shipments.update',

	'purchases.create',
	'purchases.read',
	'purchases.update',
]);

export type PermissionKey = z.infer<typeof PermissionKeySchema>;

// array of permission keys
export const AssignPermissionAPISchema = z.object({
	permissionKeys: z.array(PermissionKeySchema),
});

export type AssignPermissionAPISchema = z.infer<typeof AssignPermissionAPISchema>;

export const AssignPermissionAPISchemaResponse = z.object({
	userId: z.string(),
	permissionKey: PermissionKeySchema,
});

export type AssignPermissionAPISchemaResponse = z.infer<typeof AssignPermissionAPISchemaResponse>;
