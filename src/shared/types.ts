import { User } from "@supabase/supabase-js";

export enum UserRole {
    ROOT = 'root',
    OWNER = 'owner',
    MANAGER = 'manager',
    SUPPLIER = 'supplier',
    CASHIER = 'cashier',
    VIEWER = 'viewer'
}

export enum Permission {
    OWNER_READ = 'owner:read',
    OWNER_UPDATE = 'owner:update',
    OWNER_DELETE = 'owner:delete',
    BRANCH_CREATE = 'branch:create',
    BRANCH_READ = 'branch:read',
    BRANCH_UPDATE = 'branch:update',
    BRANCH_DELETE = 'branch:delete',
    USER_CREATE = 'user:create',
    USER_READ = 'user:read',
    USER_UPDATE = 'user:update',
    USER_DELETE = 'user:delete',
    PRODUCT_CREATE = 'product:create',
    PRODUCT_READ = 'product:read',
    PRODUCT_UPDATE = 'product:update',
    PRODUCT_DELETE = 'product:delete',
    INVENTORY_READ = 'inventory:read',
    INVENTORY_UPDATE = 'inventory:update',
    TRANSFER_CREATE = 'transfer:create',
    TRANSFER_READ = 'transfer:read',
    TRANSFER_UPDATE = 'transfer:update',
    TRANSFER_CANCEL = 'transfer:cancel',
    STOCK_MOVEMENT_CREATE = 'stock_movement:create',
    STOCK_MOVEMENT_READ = 'stock_movement:read',
    STOCK_ALERT_READ = 'stock_alert:read',
    STOCK_ALERT_RESOLVE = 'stock_alert:resolve',
    NOTIFICATION_READ = 'notification:read',
    NOTIFICATION_UPDATE = 'notification:update',
    OWNER_RELATIONSHIP_CREATE = 'owner_relationship:create',
    OWNER_RELATIONSHIP_READ = 'owner_relationship:read',
    OWNER_RELATIONSHIP_UPDATE = 'owner_relationship:update',
    OWNER_TRANSFER_CREATE = 'owner_transfer:create',
    OWNER_TRANSFER_READ = 'owner_transfer:read',
    OWNER_TRANSFER_UPDATE = 'owner_transfer:update'
}

export interface AuthContext {
    user: User;
    token: string;
    permissions: Permission[];
}

export interface ApiResponse<T = any> {
    success: boolean;
    message?: string;
    data?: T;
    error?: {
        code: string;
        message: string;
        details?: any;
    };
    meta?: {
        timestamp: string;
        request_id?: string;
    };
}
