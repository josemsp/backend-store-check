import { z } from 'zod';

export const ProductSchema = z.object({
    id: z.string().uuid(),
    sku: z.string(),
    name: z.string(),
    description: z.string().optional(),
    price: z.number(),
    is_active: z.boolean().default(true),
    created_at: z.string().datetime().default(() => new Date().toISOString()),
    updated_at: z.string().datetime(),
});

export type ProductFromZod = z.infer<typeof ProductSchema>;

export type CreateProductFromZod = Omit<ProductFromZod, 'id' | 'created_at' | 'updated_at'>;

export const CreateProductSchema = ProductSchema.omit({ id: true, created_at: true, updated_at: true });