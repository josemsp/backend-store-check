import z from "zod";
import {
    ListProductCategoriesSchema,
    ProductCategoryDBSchema,
    CreateProductCategoryAPISchema,
    ProductCategoryAPISchema,
    CreateProductCategoryDBSchema,
    UpdateProductCategoryDBSchema,
} from "./product-categories.schemas";

export type ProductCategoryAPI = z.infer<typeof ProductCategoryAPISchema>;
export type ProductCategoryDB = z.input<typeof ProductCategoryDBSchema>;

export type CreateProductCategoryInput = z.input<typeof CreateProductCategoryAPISchema>;
export type CreateProductCategoryDB = z.output<typeof CreateProductCategoryDBSchema>;

export type ProductCategoryTypeZod = z.infer<typeof ProductCategoryDBSchema>;

export type CreateProductCategoryFromZod = Omit<ProductCategoryTypeZod, 'id' | 'created_at'>;

export type CreateProductCategory = z.infer<typeof CreateProductCategoryAPISchema>;

export type UpdateProductCategoryFromZod = z.infer<typeof UpdateProductCategoryDBSchema>;

export type ListProductCategoriesParams = z.infer<typeof ListProductCategoriesSchema>;
