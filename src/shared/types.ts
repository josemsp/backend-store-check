import { User } from "@supabase/supabase-js";

export enum UserRole {
    ROOT = 'root',
    OWNER = 'owner',
    MANAGER = 'manager',
    SUPPLIER = 'supplier'
}


export enum Permission {
    // Usuarios
    USER_READ_OWN = 'user:read:own',
    USER_READ_ORG = 'user:read:org',
    USER_READ_ALL = 'user:read:all',
    USER_CREATE = 'user:create',
    USER_UPDATE_OWN = 'user:update:own',
    USER_UPDATE_ORG = 'user:update:org',
    USER_UPDATE_ALL = 'user:update:all',
    USER_DELETE = 'user:delete',

    // Organizaciones
    ORG_READ_OWN = 'org:read:own',
    ORG_READ_ALL = 'org:read:all',
    ORG_CREATE = 'org:create',
    ORG_UPDATE_OWN = 'org:update:own',
    ORG_UPDATE_ALL = 'org:update:all',
    ORG_DELETE = 'org:delete',

    // Productos
    PRODUCT_READ_OWN = 'product:read:own',
    PRODUCT_READ_ORG = 'product:read:org',
    PRODUCT_READ_ALL = 'product:read:all',
    PRODUCT_CREATE = 'product:create',
    PRODUCT_UPDATE = 'product:update',
    PRODUCT_DELETE = 'product:delete',

    // Roles
    ROLE_ASSIGN = 'role:assign',
    ROLE_REVOKE = 'role:revoke',

    // Audit
    AUDIT_READ_OWN = 'audit:read:own',
    AUDIT_READ_ORG = 'audit:read:org',
    AUDIT_READ_ALL = 'audit:read:all'
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
