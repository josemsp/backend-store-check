import z from "zod";
import {
    ListStockAlertsSchema,
    StockAlertDBSchema,
    CreateStockAlertAPISchema,
    StockAlertAPISchema,
    CreateStockAlertDBSchema,
    UpdateStockAlertDBSchema,
} from "./stock-alerts.schemas";

export type StockAlertAPI = z.infer<typeof StockAlertAPISchema>;
export type StockAlertDB = z.input<typeof StockAlertDBSchema>;

export type CreateStockAlertInput = z.input<typeof CreateStockAlertAPISchema>;
export type CreateStockAlertDB = z.output<typeof CreateStockAlertDBSchema>;

export type StockAlertTypeZod = z.infer<typeof StockAlertDBSchema>;

export type CreateStockAlertFromZod = Omit<StockAlertTypeZod, 'id' | 'notified_at' | 'resolved_at' | 'resolved_by'>;

export type CreateStockAlert = z.infer<typeof CreateStockAlertAPISchema>;

export type UpdateStockAlertFromZod = z.infer<typeof UpdateStockAlertDBSchema>;

export type ListStockAlertsParams = z.infer<typeof ListStockAlertsSchema>;
