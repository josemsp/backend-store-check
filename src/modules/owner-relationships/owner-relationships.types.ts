import z from "zod";
import {
    ListOwnerRelationshipsSchema,
    OwnerRelationshipDBSchema,
    CreateOwnerRelationshipAPISchema,
    OwnerRelationshipAPISchema,
    CreateOwnerRelationshipDBSchema,
    UpdateOwnerRelationshipDBSchema,
} from "./owner-relationships.schemas";

export type OwnerRelationshipAPI = z.infer<typeof OwnerRelationshipAPISchema>;
export type OwnerRelationshipDB = z.input<typeof OwnerRelationshipDBSchema>;

export type CreateOwnerRelationshipInput = z.input<typeof CreateOwnerRelationshipAPISchema>;
export type CreateOwnerRelationshipDB = z.output<typeof CreateOwnerRelationshipDBSchema>;

export type OwnerRelationshipTypeZod = z.infer<typeof OwnerRelationshipDBSchema>;

export type CreateOwnerRelationshipFromZod = Omit<OwnerRelationshipTypeZod, 'id' | 'created_at' | 'updated_at'>;

export type CreateOwnerRelationship = z.infer<typeof CreateOwnerRelationshipAPISchema>;

export type UpdateOwnerRelationshipFromZod = z.infer<typeof UpdateOwnerRelationshipDBSchema>;

export type ListOwnerRelationshipsParams = z.infer<typeof ListOwnerRelationshipsSchema>;
