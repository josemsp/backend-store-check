export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  core: {
    Tables: {
      branch_users: {
        Row: {
          branch_id: string
          user_id: string
        }
        Insert: {
          branch_id: string
          user_id: string
        }
        Update: {
          branch_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "branch_users_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
        ]
      }
      branches: {
        Row: {
          address: string | null
          company_id: string
          created_at: string | null
          id: string
          name: string
          timezone: string | null
        }
        Insert: {
          address?: string | null
          company_id: string
          created_at?: string | null
          id?: string
          name: string
          timezone?: string | null
        }
        Update: {
          address?: string | null
          company_id?: string
          created_at?: string | null
          id?: string
          name?: string
          timezone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "branches_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          created_at: string | null
          id: string
          legal_name: string | null
          name: string
          tax_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          legal_name?: string | null
          name: string
          tax_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          legal_name?: string | null
          name?: string
          tax_id?: string | null
        }
        Relationships: []
      }
      company_settings: {
        Row: {
          company_id: string
          created_at: string | null
          currency: string | null
          low_stock_alerts: boolean | null
          timezone: string | null
        }
        Insert: {
          company_id: string
          created_at?: string | null
          currency?: string | null
          low_stock_alerts?: boolean | null
          timezone?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string | null
          currency?: string | null
          low_stock_alerts?: boolean | null
          timezone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_settings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      invitations: {
        Row: {
          accepted_at: string | null
          company_id: string | null
          created_at: string | null
          email: string
          expires_at: string
          id: string
          invited_by: string
          role_id: string
          token: string
        }
        Insert: {
          accepted_at?: string | null
          company_id?: string | null
          created_at?: string | null
          email: string
          expires_at: string
          id?: string
          invited_by: string
          role_id: string
          token: string
        }
        Update: {
          accepted_at?: string | null
          company_id?: string | null
          created_at?: string | null
          email?: string
          expires_at?: string
          id?: string
          invited_by?: string
          role_id?: string
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "invitations_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invitations_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "v_my_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invitations_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "v_user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invitations_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invitations_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "v_my_profile"
            referencedColumns: ["role_id"]
          },
          {
            foreignKeyName: "invitations_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "v_user_profiles"
            referencedColumns: ["role_id"]
          },
        ]
      }
      owner_invitations: {
        Row: {
          created_at: string | null
          email: string
          expires_at: string
          id: string
          status: string | null
          token: string
        }
        Insert: {
          created_at?: string | null
          email: string
          expires_at: string
          id?: string
          status?: string | null
          token: string
        }
        Update: {
          created_at?: string | null
          email?: string
          expires_at?: string
          id?: string
          status?: string | null
          token?: string
        }
        Relationships: []
      }
      permissions: {
        Row: {
          id: string
          key: Database["core"]["Enums"]["permission_key"]
        }
        Insert: {
          id?: string
          key: Database["core"]["Enums"]["permission_key"]
        }
        Update: {
          id?: string
          key?: Database["core"]["Enums"]["permission_key"]
        }
        Relationships: []
      }
      platform_users: {
        Row: {
          created_at: string | null
          id: string
          role: string
        }
        Insert: {
          created_at?: string | null
          id: string
          role: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "platform_users_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "v_my_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "platform_users_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "v_user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          company_id: string | null
          created_at: string | null
          deleted_at: string | null
          email: string
          first_name: string | null
          full_name: string | null
          id: string
          last_name: string | null
          status: Database["core"]["Enums"]["user_status"]
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          company_id?: string | null
          created_at?: string | null
          deleted_at?: string | null
          email: string
          first_name?: string | null
          full_name?: string | null
          id: string
          last_name?: string | null
          status?: Database["core"]["Enums"]["user_status"]
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          company_id?: string | null
          created_at?: string | null
          deleted_at?: string | null
          email?: string
          first_name?: string | null
          full_name?: string | null
          id?: string
          last_name?: string | null
          status?: Database["core"]["Enums"]["user_status"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "v_my_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "v_user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      role_permissions: {
        Row: {
          permission_id: string
          role_id: string
        }
        Insert: {
          permission_id: string
          role_id: string
        }
        Update: {
          permission_id?: string
          role_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_permissions_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "v_my_profile"
            referencedColumns: ["role_id"]
          },
          {
            foreignKeyName: "role_permissions_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "v_user_profiles"
            referencedColumns: ["role_id"]
          },
        ]
      }
      roles: {
        Row: {
          company_id: string | null
          created_at: string
          description: string | null
          id: string
          is_system_role: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_system_role?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_system_role?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "roles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      user_permissions: {
        Row: {
          permission: Database["core"]["Enums"]["permission_key"]
          user_id: string
        }
        Insert: {
          permission: Database["core"]["Enums"]["permission_key"]
          user_id: string
        }
        Update: {
          permission?: Database["core"]["Enums"]["permission_key"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_permissions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_my_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_permissions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          company_id: string | null
          id: string
          role_id: string | null
          user_id: string
        }
        Insert: {
          company_id?: string | null
          id?: string
          role_id?: string | null
          user_id: string
        }
        Update: {
          company_id?: string | null
          id?: string
          role_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_company_fk"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "v_my_profile"
            referencedColumns: ["role_id"]
          },
          {
            foreignKeyName: "user_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "v_user_profiles"
            referencedColumns: ["role_id"]
          },
        ]
      }
    }
    Views: {
      v_my_profile: {
        Row: {
          avatar_url: string | null
          company_id: string | null
          company_name: string | null
          created_at: string | null
          email: string | null
          first_name: string | null
          full_name: string | null
          id: string | null
          is_owner: boolean | null
          is_root: boolean | null
          last_name: string | null
          permissions: string[] | null
          role_id: string | null
          role_name: string | null
          status: Database["core"]["Enums"]["user_status"] | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      v_user_profiles: {
        Row: {
          avatar_url: string | null
          company_id: string | null
          company_name: string | null
          created_at: string | null
          email: string | null
          first_name: string | null
          full_name: string | null
          id: string | null
          is_owner: boolean | null
          is_root: boolean | null
          last_name: string | null
          permissions: string[] | null
          role_id: string | null
          role_name: string | null
          status: Database["core"]["Enums"]["user_status"] | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      current_company_id: { Args: never; Returns: string }
      current_role: { Args: never; Returns: string }
      get_id_root_role: { Args: never; Returns: string }
      get_permissions_by_user: {
        Args: { p_user_id: string }
        Returns: {
          key: string
        }[]
      }
      get_role_ids_by_names: {
        Args: { role_names: string[] }
        Returns: string[]
      }
      get_roleid_by_name: { Args: { role_name: string }; Returns: string }
      has_any_role: {
        Args: { roles: string[]; target_company: string }
        Returns: boolean
      }
      has_role: {
        Args: { required_role: string; target_company: string }
        Returns: boolean
      }
      is_root: { Args: never; Returns: boolean }
      same_company: { Args: { target_company: string }; Returns: boolean }
      user_branches: { Args: never; Returns: string[] }
    }
    Enums: {
      permission_key:
        | "users.read"
        | "users.invite"
        | "users.update"
        | "users.remove"
        | "roles.assign"
        | "company.create"
        | "company.read"
        | "company.update"
        | "company.delete"
        | "branches.create"
        | "branches.read"
        | "branches.update"
        | "branches.delete"
        | "shipments.create"
        | "shipments.read"
        | "shipments.update"
        | "purchases.create"
        | "purchases.read"
        | "purchases.update"
      user_status: "active" | "inactive" | "deleted"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  events: {
    Tables: {
      events: {
        Row: {
          aggregate: string
          id: string
          occurred_at: string
          payload: Json
          processed: boolean
          type: string
        }
        Insert: {
          aggregate: string
          id?: string
          occurred_at?: string
          payload: Json
          processed?: boolean
          type: string
        }
        Update: {
          aggregate?: string
          id?: string
          occurred_at?: string
          payload?: Json
          processed?: boolean
          type?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      emit: { Args: { event_type: string; payload: Json }; Returns: undefined }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  inventory: {
    Tables: {
      inventory: {
        Row: {
          branch_id: string | null
          id: string
          max_stock: number | null
          min_stock: number | null
          product_id: string | null
          stock_available: number | null
          stock_in_transit: number | null
          stock_reserved: number | null
          updated_at: string | null
        }
        Insert: {
          branch_id?: string | null
          id?: string
          max_stock?: number | null
          min_stock?: number | null
          product_id?: string | null
          stock_available?: number | null
          stock_in_transit?: number | null
          stock_reserved?: number | null
          updated_at?: string | null
        }
        Update: {
          branch_id?: string | null
          id?: string
          max_stock?: number | null
          min_stock?: number | null
          product_id?: string | null
          stock_available?: number | null
          stock_in_transit?: number | null
          stock_reserved?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      inventory_batches: {
        Row: {
          batch_number: string | null
          expires_at: string | null
          id: string
          inventory_id: string | null
          quantity: number
          serial_number: string | null
        }
        Insert: {
          batch_number?: string | null
          expires_at?: string | null
          id?: string
          inventory_id?: string | null
          quantity: number
          serial_number?: string | null
        }
        Update: {
          batch_number?: string | null
          expires_at?: string | null
          id?: string
          inventory_id?: string | null
          quantity?: number
          serial_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_batches_inventory_id_fkey"
            columns: ["inventory_id"]
            isOneToOne: false
            referencedRelation: "inventory"
            referencedColumns: ["id"]
          },
        ]
      }
      stock_movements: {
        Row: {
          branch_id: string | null
          created_at: string | null
          delta: number
          id: string
          product_id: string | null
          reason: string | null
          reference_id: string | null
          reference_table: string | null
        }
        Insert: {
          branch_id?: string | null
          created_at?: string | null
          delta: number
          id?: string
          product_id?: string | null
          reason?: string | null
          reference_id?: string | null
          reference_table?: string | null
        }
        Update: {
          branch_id?: string | null
          created_at?: string | null
          delta?: number
          id?: string
          product_id?: string | null
          reason?: string | null
          reference_id?: string | null
          reference_table?: string | null
        }
        Relationships: []
      }
      stock_transfers: {
        Row: {
          created_at: string | null
          from_branch_id: string | null
          id: string
          product_id: string | null
          quantity: number
          received_at: string | null
          status: string | null
          to_branch_id: string | null
        }
        Insert: {
          created_at?: string | null
          from_branch_id?: string | null
          id?: string
          product_id?: string | null
          quantity: number
          received_at?: string | null
          status?: string | null
          to_branch_id?: string | null
        }
        Update: {
          created_at?: string | null
          from_branch_id?: string | null
          id?: string
          product_id?: string | null
          quantity?: number
          received_at?: string | null
          status?: string | null
          to_branch_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: "root" | "admin" | "user"
      user_status: "active" | "deactive"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  core: {
    Enums: {
      permission_key: [
        "users.read",
        "users.invite",
        "users.update",
        "users.remove",
        "roles.assign",
        "company.create",
        "company.read",
        "company.update",
        "company.delete",
        "branches.create",
        "branches.read",
        "branches.update",
        "branches.delete",
        "shipments.create",
        "shipments.read",
        "shipments.update",
        "purchases.create",
        "purchases.read",
        "purchases.update",
      ],
      user_status: ["active", "inactive", "deleted"],
    },
  },
  events: {
    Enums: {},
  },
  inventory: {
    Enums: {},
  },
  public: {
    Enums: {
      user_role: ["root", "admin", "user"],
      user_status: ["active", "deactive"],
    },
  },
} as const
