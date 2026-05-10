import z from "zod";
import {
    ListProductUnitsSchema,
    ProductUnitDBSchema,
    CreateProductUnitAPISchema,
    ProductUnitAPISchema,
    CreateProductUnitDBSchema,
    UpdateProductUnitDBSchema,
} from "./product-units.schemas";

export type ProductUnitAPI = z.infer<typeof ProductUnitAPISchema>;
export type ProductUnitDB = z.input<typeof ProductUnitDBSchema>;

export type CreateProductUnitInput = z.input<typeof CreateProductUnitAPISchema>;
export type CreateProductUnitDB = z.output<typeof CreateProductUnitDBSchema>;

export type ProductUnitTypeZod = z.infer<typeof ProductUnitDBSchema>;

export type CreateProductUnitFromZod = Omit<ProductUnitTypeZod, 'id' | 'created_at'>;

export type CreateProductUnit = z.infer<typeof CreateProductUnitAPISchema>;

export type UpdateProductUnitFromZod = z.infer<typeof UpdateProductUnitDBSchema>;

export type ListProductUnitsParams = z.infer<typeof ListProductUnitsSchema>;
