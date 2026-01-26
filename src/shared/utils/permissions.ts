import { UserAPI } from '../../modules/users/users.types';
import { UserRole, Permission } from '../types';

// Mapa de permisos por rol
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
    [UserRole.ROOT]: [
        // Root tiene TODOS los permisos
        Permission.USER_READ_ALL,
        Permission.USER_CREATE,
        Permission.USER_UPDATE_ALL,
        Permission.USER_DELETE,
        Permission.ORG_READ_ALL,
        Permission.ORG_CREATE,
        Permission.ORG_UPDATE_ALL,
        Permission.ORG_DELETE,
        Permission.PRODUCT_READ_ALL,
        Permission.PRODUCT_CREATE,
        Permission.PRODUCT_UPDATE,
        Permission.PRODUCT_DELETE,
        Permission.ROLE_ASSIGN,
        Permission.ROLE_REVOKE,
        Permission.AUDIT_READ_ALL
    ],

    [UserRole.OWNER]: [
        // Owner puede gestionar su organización
        Permission.USER_READ_OWN,
        Permission.USER_READ_ORG,
        Permission.USER_CREATE,
        Permission.USER_UPDATE_ORG,
        Permission.ORG_READ_OWN,
        Permission.ORG_UPDATE_OWN,
        Permission.PRODUCT_READ_ORG,
        Permission.PRODUCT_CREATE,
        Permission.PRODUCT_UPDATE,
        Permission.PRODUCT_DELETE,
        Permission.ROLE_ASSIGN,
        Permission.AUDIT_READ_ORG
    ],

    [UserRole.MANAGER]: [
        // Manager puede gestionar recursos pero no usuarios ni roles
        Permission.USER_READ_OWN,
        Permission.USER_READ_ORG,
        Permission.ORG_READ_OWN,
        Permission.PRODUCT_READ_ORG,
        Permission.PRODUCT_CREATE,
        Permission.PRODUCT_UPDATE,
        Permission.AUDIT_READ_OWN
    ],

    [UserRole.SUPPLIER]: [
        // Supplier solo lectura básica
        Permission.USER_READ_OWN,
        Permission.USER_UPDATE_OWN,
        Permission.ORG_READ_OWN,
        Permission.PRODUCT_READ_ORG,
        Permission.AUDIT_READ_OWN
    ]
};

// Jerarquía de roles (para verificaciones de autoridad)
export const ROLE_HIERARCHY: Record<UserRole, number> = {
    [UserRole.ROOT]: 4,
    [UserRole.OWNER]: 3,
    [UserRole.MANAGER]: 2,
    [UserRole.SUPPLIER]: 1
};


export function hasPermission(user: UserAPI, permission: string): boolean {
    return user.permissions.includes(permission);
}

/**
 * Helper para verificar múltiples permisos
 */
export function hasAllPermissions(
    user: UserAPI,
    permissions: string[]
): boolean {
    return permissions.every((perm) => user.permissions.includes(perm));
}

/**
 * Helper para verificar al menos un permiso
 */
export function hasAnyPermission(
    user: UserAPI,
    permissions: string[]
): boolean {
    return permissions.some((perm) => user.permissions.includes(perm));
}

/**
 * Helper para verificar rol
 */
export function hasRole(user: UserAPI, roleName: string): boolean {
    return user.roles.some((role) => role.name === roleName);
}

// Verifica si un rol tiene un permiso específico
// export function hasPermission(role: UserRole, permission: Permission): boolean {
//     return ROLE_PERMISSIONS[role]?.includes(permission) || false;
// }

// // Verifica si un rol tiene autoridad sobre otro
// export function hasAuthorityOver(actorRole: UserRole, targetRole: UserRole): boolean {
//     return ROLE_HIERARCHY[actorRole] > ROLE_HIERARCHY[targetRole];
// }

// // Obtiene todos los permisos de un rol
// export function getPermissions(role: UserRole): Permission[] {
//     return ROLE_PERMISSIONS[role] || [];
// }

// Verifica múltiples permisos (requiere todos)
// export function hasAllPermissions(role: UserRole, permissions: Permission[]): boolean {
//     const rolePermissions = ROLE_PERMISSIONS[role] || [];
//     return permissions.every(p => rolePermissions.includes(p));
// }

// // Verifica múltiples permisos (requiere al menos uno)
// export function hasAnyPermission(role: UserRole, permissions: Permission[]): boolean {
//     const rolePermissions = ROLE_PERMISSIONS[role] || [];
//     return permissions.some(p => rolePermissions.includes(p));
// }