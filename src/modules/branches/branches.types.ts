import z from 'zod';
import {
	ListBranchesSchema,
	BranchDBSchema,
	CreateBranchAPISchema,
	BranchAPISchema,
	CreateBranchDBSchema,
	UpdateBranchDBSchema,
} from './branches.schemas';
import { Enums } from '../../shared/supabase';

export type BranchAPI = z.infer<typeof BranchAPISchema>;
export type BranchDB = z.input<typeof BranchDBSchema>;

export type CreateBranchInput = z.input<typeof CreateBranchAPISchema>;
export type CreateBranchDB = z.output<typeof CreateBranchDBSchema>;

export type BranchTypeZod = z.infer<typeof BranchDBSchema>;

export type CreateBranchFromZod = Omit<BranchTypeZod, 'id' | 'created_at' | 'updated_at'>;

export type CreateBranch = z.infer<typeof CreateBranchAPISchema>;

export type UpdateBranchFromZod = z.infer<typeof UpdateBranchDBSchema>;

export type ListBranchesParams = z.infer<typeof ListBranchesSchema>;

export type BranchType = Enums<'branch_type'>;
