import z from "zod";
import {
    ListOwnersSchema,
    OwnerDBSchema,
    CreateOwnerAPISchema,
    OwnerAPISchema,
    CreateOwnerDBSchema,
    UpdateOwnerDBSchema,
} from "./owners.schemas";

export type OwnerAPI = z.infer<typeof OwnerAPISchema>;
export type OwnerDB = z.input<typeof OwnerDBSchema>;

export type CreateOwnerInput = z.input<typeof CreateOwnerAPISchema>;
export type CreateOwnerDB = z.output<typeof CreateOwnerDBSchema>;

export type OwnerTypeZod = z.infer<typeof OwnerDBSchema>;

export type CreateOwnerFromZod = Omit<OwnerTypeZod, 'id' | 'created_at' | 'updated_at'>;

export type CreateOwner = z.infer<typeof CreateOwnerAPISchema>

export type UpdateOwnerFromZod = z.infer<typeof UpdateOwnerDBSchema>;

export type ListOwnersParams = z.infer<typeof ListOwnersSchema>;
