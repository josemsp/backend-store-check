import z from 'zod';
import { Database } from '../../shared/supabase';
import { ListOwnersSchema } from './owners.schemas';

export type OwnerInsertInput = Database['public']['Tables']['owners']['Insert'];
export type OwnerUpdateInput = Omit<Database['public']['Tables']['owners']['Update'], 'id' | 'created_at' | 'updated_at'>;

export type ListOwnersParams = z.infer<typeof ListOwnersSchema>;
