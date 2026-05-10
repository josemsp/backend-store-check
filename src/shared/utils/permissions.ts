import { UserAPI } from '../../modules/users/users.types';
import { UserRole, Permission } from '../types';

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
    [UserRole.ROOT]: [
        Permission.OWNER_READ,
        Permission.OWNER_UPDATE,
        Permission.OWNER_DELETE,
        Permission.BRANCH_CREATE,
        Permission.BRANCH_READ,
        Permission.BRANCH_UPDATE,
        Permission.BRANCH_DELETE,
        Permission.USER_CREATE,
        Permission.USER_READ,
        Permission.USER_UPDATE,
        Permission.USER_DELETE,
        Permission.PRODUCT_CREATE,
        Permission.PRODUCT_READ,
        Permission.PRODUCT_UPDATE,
        Permission.PRODUCT_DELETE,
        Permission.INVENTORY_READ,
        Permission.INVENTORY_UPDATE,
        Permission.TRANSFER_CREATE,
        Permission.TRANSFER_READ,
        Permission.TRANSFER_UPDATE,
        Permission.TRANSFER_CANCEL,
        Permission.STOCK_MOVEMENT_CREATE,
        Permission.STOCK_MOVEMENT_READ,
        Permission.STOCK_ALERT_READ,
        Permission.STOCK_ALERT_RESOLVE,
        Permission.NOTIFICATION_READ,
        Permission.NOTIFICATION_UPDATE,
        Permission.OWNER_RELATIONSHIP_CREATE,
        Permission.OWNER_RELATIONSHIP_READ,
        Permission.OWNER_RELATIONSHIP_UPDATE,
        Permission.OWNER_TRANSFER_CREATE,
        Permission.OWNER_TRANSFER_READ,
        Permission.OWNER_TRANSFER_UPDATE
    ],
    [UserRole.OWNER]: [
        Permission.OWNER_READ,
        Permission.OWNER_UPDATE,
        Permission.BRANCH_CREATE,
        Permission.BRANCH_READ,
        Permission.BRANCH_UPDATE,
        Permission.BRANCH_DELETE,
        Permission.USER_CREATE,
        Permission.USER_READ,
        Permission.USER_UPDATE,
        Permission.USER_DELETE,
        Permission.PRODUCT_CREATE,
        Permission.PRODUCT_READ,
        Permission.PRODUCT_UPDATE,
        Permission.PRODUCT_DELETE,
        Permission.INVENTORY_READ,
        Permission.INVENTORY_UPDATE,
        Permission.TRANSFER_CREATE,
        Permission.TRANSFER_READ,
        Permission.TRANSFER_UPDATE,
        Permission.TRANSFER_CANCEL,
        Permission.STOCK_MOVEMENT_CREATE,
        Permission.STOCK_MOVEMENT_READ,
        Permission.STOCK_ALERT_READ,
        Permission.STOCK_ALERT_RESOLVE,
        Permission.NOTIFICATION_READ,
        Permission.NOTIFICATION_UPDATE,
        Permission.OWNER_RELATIONSHIP_CREATE,
        Permission.OWNER_RELATIONSHIP_READ,
        Permission.OWNER_RELATIONSHIP_UPDATE,
        Permission.OWNER_TRANSFER_CREATE,
        Permission.OWNER_TRANSFER_READ,
        Permission.OWNER_TRANSFER_UPDATE
    ],
    [UserRole.MANAGER]: [
        Permission.OWNER_READ,
        Permission.BRANCH_READ,
        Permission.BRANCH_UPDATE,
        Permission.USER_READ,
        Permission.USER_UPDATE,
        Permission.PRODUCT_CREATE,
        Permission.PRODUCT_READ,
        Permission.PRODUCT_UPDATE,
        Permission.INVENTORY_READ,
        Permission.INVENTORY_UPDATE,
        Permission.TRANSFER_CREATE,
        Permission.TRANSFER_READ,
        Permission.TRANSFER_UPDATE,
        Permission.STOCK_MOVEMENT_CREATE,
        Permission.STOCK_MOVEMENT_READ,
        Permission.STOCK_ALERT_READ,
        Permission.STOCK_ALERT_RESOLVE,
        Permission.NOTIFICATION_READ
    ],
    [UserRole.SUPPLIER]: [
        Permission.OWNER_READ,
        Permission.BRANCH_READ,
        Permission.USER_READ,
        Permission.PRODUCT_READ,
        Permission.INVENTORY_READ,
        Permission.TRANSFER_READ,
        Permission.STOCK_MOVEMENT_READ,
        Permission.STOCK_ALERT_READ,
        Permission.NOTIFICATION_READ
    ],
    [UserRole.CASHIER]: [
        Permission.OWNER_READ,
        Permission.BRANCH_READ,
        Permission.USER_READ,
        Permission.PRODUCT_READ,
        Permission.INVENTORY_READ,
        Permission.TRANSFER_READ,
        Permission.STOCK_MOVEMENT_READ,
        Permission.STOCK_ALERT_READ,
        Permission.NOTIFICATION_READ
    ],
    [UserRole.VIEWER]: [
        Permission.OWNER_READ,
        Permission.BRANCH_READ,
        Permission.USER_READ,
        Permission.PRODUCT_READ,
        Permission.INVENTORY_READ,
        Permission.TRANSFER_READ,
        Permission.STOCK_MOVEMENT_READ,
        Permission.STOCK_ALERT_READ,
        Permission.NOTIFICATION_READ
    ]
};

export const ROLE_HIERARCHY: Record<UserRole, number> = {
    [UserRole.ROOT]: 6,
    [UserRole.OWNER]: 5,
    [UserRole.MANAGER]: 4,
    [UserRole.SUPPLIER]: 3,
    [UserRole.CASHIER]: 2,
    [UserRole.VIEWER]: 1
};

export function hasPermission(user: UserAPI, permission: string): boolean {
    return user.permissions.includes(permission);
}

export function hasAllPermissions(
    user: UserAPI,
    permissions: string[]
): boolean {
    return permissions.every((perm) => user.permissions.includes(perm));
}

export function hasAnyPermission(
    user: UserAPI,
    permissions: string[]
): boolean {
    return permissions.some((perm) => user.permissions.includes(perm));
}

export function hasRole(user: UserAPI, roleName: string): boolean {
    return user.role === roleName;
}
