import { z } from 'zod';

export const ProductSchema = z.object({
    id: z.string().uuid(),
    owner_id: z.string().uuid(),
    name: z.string(),
    description: z.string().optional(),
    category_id: z.string().uuid(),
    unit_id: z.string().uuid(),
    min_stock_alert: z.number().default(10),
    cost_price: z.number().optional(),
    sale_price: z.number().optional(),
    sku: z.string().optional(),
    image_url: z.string().optional(),
    is_active: z.boolean().default(true),
    created_at: z.string().datetime(),
    updated_at: z.string().datetime(),
});

export type ProductFromZod = z.infer<typeof ProductSchema>;

export type CreateProductFromZod = Omit<ProductFromZod, 'id' | 'created_at' | 'updated_at'>;

export const CreateProductSchema = ProductSchema.omit({ id: true, created_at: true, updated_at: true });

export const UpdateProductSchema = CreateProductSchema.partial();

export const ListProductsSchema = z.object({
    page: z.coerce.number().min(1).default(1),
    pageSize: z.coerce.number().min(1).max(100).default(10),
    search: z.string().optional(),
    categoryId: z.string().uuid().optional(),
    isActive: z.coerce.boolean().optional(),
    sortBy: z.enum(['created_at', 'name', 'sku']).default('created_at'),
    sortDir: z.enum(['asc', 'desc']).default('desc'),
});
