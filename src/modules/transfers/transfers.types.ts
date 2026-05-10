import z from "zod";
import {
    ListTransfersSchema,
    TransferDBSchema,
    CreateTransferAPISchema,
    TransferAPISchema,
    CreateTransferDBSchema,
    UpdateTransferDBSchema,
    TransferItemDBSchema,
    TransferItemAPISchema,
} from "./transfers.schemas";

export type TransferAPI = z.infer<typeof TransferAPISchema>;
export type TransferDB = z.input<typeof TransferDBSchema>;

export type CreateTransferInput = z.input<typeof CreateTransferAPISchema>;
export type CreateTransferDB = z.output<typeof CreateTransferDBSchema>;

export type TransferTypeZod = z.infer<typeof TransferDBSchema>;

export type CreateTransferFromZod = Omit<TransferTypeZod, 'id' | 'created_at' | 'updated_at' | 'sent_at' | 'received_at'>;

export type CreateTransfer = z.infer<typeof CreateTransferAPISchema>;

export type UpdateTransferFromZod = z.infer<typeof UpdateTransferDBSchema>;

export type TransferItemAPI = z.infer<typeof TransferItemAPISchema>;
export type TransferItemDB = z.input<typeof TransferItemDBSchema>;

export type ListTransfersParams = z.infer<typeof ListTransfersSchema>;
