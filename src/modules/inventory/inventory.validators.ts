import { z } from 'zod';

export const moveStockSchema = z.object({
    productId: z.string(),
    warehouseId: z.string(),
    quantity: z.number(),
    userId: z.string(), // comment later
});