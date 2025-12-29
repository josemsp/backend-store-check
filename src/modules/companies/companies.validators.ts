import { z } from "zod";
import { Database } from "../../shared/supabase";

type Company = Database["core"]["Tables"]["companies"]["Row"];

export const CompanySchema = z.object({
    id: z.string(),
    name: z.string().min(1),
    legal_name: z.string().nullable(),
    tax_id: z.string().nullable(),
    created_at: z.string().nullable(),
});

export type CompanyFromZod = z.infer<typeof CompanySchema>;

export const CreateCompanySchema = CompanySchema
    .omit({ id: true, created_at: true })
    .extend({
        name: z.string().min(1),
        legal_name: z.string().nullable().optional(),
        tax_id: z.string().nullable().optional(),
    });

export type CreateCompanyFromZod = z.infer<typeof CreateCompanySchema>;

export const UpdateCompanySchema = CreateCompanySchema.partial();

export type UpdateCompanyFromZod = z.infer<typeof UpdateCompanySchema>;

// pagination + filters
export const ListCompaniesSchema = z.object({
    page: z.coerce.number().min(1).default(1),
    pageSize: z.coerce.number().min(1).max(100).default(10),

    search: z.string().optional(),

    sortBy: z.enum(["created_at", "name"]).default("created_at"),
    sortDir: z.enum(["asc", "desc"]).default("desc"),
});

export type ListCompaniesParams = z.infer<typeof ListCompaniesSchema>;
