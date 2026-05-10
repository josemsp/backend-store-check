import z from "zod";
import {
    ListOwnerTransfersSchema,
    OwnerTransferDBSchema,
    CreateOwnerTransferAPISchema,
    OwnerTransferAPISchema,
    CreateOwnerTransferDBSchema,
    UpdateOwnerTransferDBSchema,
    OwnerTransferItemDBSchema,
    OwnerTransferItemAPISchema,
} from "./owner-transfers.schemas";

export type OwnerTransferAPI = z.infer<typeof OwnerTransferAPISchema>;
export type OwnerTransferDB = z.input<typeof OwnerTransferDBSchema>;

export type CreateOwnerTransferInput = z.input<typeof CreateOwnerTransferAPISchema>;
export type CreateOwnerTransferDB = z.output<typeof CreateOwnerTransferDBSchema>;

export type OwnerTransferTypeZod = z.infer<typeof OwnerTransferDBSchema>;

export type CreateOwnerTransferFromZod = Omit<OwnerTransferTypeZod, 'id' | 'created_at' | 'updated_at' | 'sent_at' | 'received_at' | 'received_by'>;

export type CreateOwnerTransfer = z.infer<typeof CreateOwnerTransferAPISchema>;

export type UpdateOwnerTransferFromZod = z.infer<typeof UpdateOwnerTransferDBSchema>;

export type OwnerTransferItemAPI = z.infer<typeof OwnerTransferItemAPISchema>;
export type OwnerTransferItemDB = z.input<typeof OwnerTransferItemDBSchema>;

export type ListOwnerTransfersParams = z.infer<typeof ListOwnerTransfersSchema>;
