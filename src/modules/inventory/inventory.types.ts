import z from "zod";
import {
    ListInventorySchema,
    InventoryDBSchema,
    CreateInventoryAPISchema,
    InventoryAPISchema,
    CreateInventoryDBSchema,
    UpdateInventoryDBSchema,
} from "./inventory.schemas";

export type InventoryAPI = z.infer<typeof InventoryAPISchema>;
export type InventoryDB = z.input<typeof InventoryDBSchema>;

export type CreateInventoryInput = z.input<typeof CreateInventoryAPISchema>;
export type CreateInventoryDB = z.output<typeof CreateInventoryDBSchema>;

export type InventoryTypeZod = z.infer<typeof InventoryDBSchema>;

export type CreateInventoryFromZod = Omit<InventoryTypeZod, 'id' | 'updated_at'>;

export type CreateInventory = z.infer<typeof CreateInventoryAPISchema>;

export type UpdateInventoryFromZod = z.infer<typeof UpdateInventoryDBSchema>;

export type ListInventoryParams = z.infer<typeof ListInventorySchema>;
