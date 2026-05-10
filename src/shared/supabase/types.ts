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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      branches: {
        Row: {
          address: string | null
          created_at: string
          id: string
          is_active: boolean
          latitude: number | null
          longitude: number | null
          name: string
          owner_id: string
          phone: string | null
          type: Database["public"]["Enums"]["branch_type"]
          updated_at: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          latitude?: number | null
          longitude?: number | null
          name: string
          owner_id: string
          phone?: string | null
          type: Database["public"]["Enums"]["branch_type"]
          updated_at?: string
        }
        Update: {
          address?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          latitude?: number | null
          longitude?: number | null
          name?: string
          owner_id?: string
          phone?: string | null
          type?: Database["public"]["Enums"]["branch_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "branches_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "owners"
            referencedColumns: ["id"]
          },
        ]
      }
      healthcheck: {
        Row: {
          id: number
        }
        Insert: {
          id: number
        }
        Update: {
          id?: number
        }
        Relationships: []
      }
      inventory: {
        Row: {
          branch_id: string
          id: string
          owner_id: string
          product_id: string
          quantity: number
          updated_at: string
        }
        Insert: {
          branch_id: string
          id?: string
          owner_id: string
          product_id: string
          quantity?: number
          updated_at?: string
        }
        Update: {
          branch_id?: string
          id?: string
          owner_id?: string
          product_id?: string
          quantity?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "v_company_users"
            referencedColumns: ["branch_id"]
          },
          {
            foreignKeyName: "inventory_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "v_current_user"
            referencedColumns: ["branch_id"]
          },
          {
            foreignKeyName: "inventory_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "v_users_full"
            referencedColumns: ["branch_id"]
          },
          {
            foreignKeyName: "inventory_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "vw_branch_inventory_summary"
            referencedColumns: ["branch_id"]
          },
          {
            foreignKeyName: "inventory_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "owners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      invitations: {
        Row: {
          branch_id: string | null
          created_at: string | null
          email: string
          expires_at: string | null
          id: string
          invited_by: string | null
          is_system_invite: boolean
          owner_id: string | null
          role: Database["public"]["Enums"]["user_role"]
          status: string
          token: string
        }
        Insert: {
          branch_id?: string | null
          created_at?: string | null
          email: string
          expires_at?: string | null
          id?: string
          invited_by?: string | null
          is_system_invite?: boolean
          owner_id?: string | null
          role: Database["public"]["Enums"]["user_role"]
          status?: string
          token: string
        }
        Update: {
          branch_id?: string | null
          created_at?: string | null
          email?: string
          expires_at?: string | null
          id?: string
          invited_by?: string | null
          is_system_invite?: boolean
          owner_id?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          status?: string
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "invitations_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invitations_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "v_company_users"
            referencedColumns: ["branch_id"]
          },
          {
            foreignKeyName: "invitations_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "v_current_user"
            referencedColumns: ["branch_id"]
          },
          {
            foreignKeyName: "invitations_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "v_users_full"
            referencedColumns: ["branch_id"]
          },
          {
            foreignKeyName: "invitations_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "vw_branch_inventory_summary"
            referencedColumns: ["branch_id"]
          },
          {
            foreignKeyName: "invitations_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "owners"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string
          channel: Database["public"]["Enums"]["notification_channel"]
          created_at: string
          id: string
          is_read: boolean
          metadata: Json
          owner_id: string
          platform: Database["public"]["Enums"]["notification_platform"]
          reference_id: string | null
          reference_type: string | null
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string | null
        }
        Insert: {
          body: string
          channel?: Database["public"]["Enums"]["notification_channel"]
          created_at?: string
          id?: string
          is_read?: boolean
          metadata?: Json
          owner_id: string
          platform?: Database["public"]["Enums"]["notification_platform"]
          reference_id?: string | null
          reference_type?: string | null
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id?: string | null
        }
        Update: {
          body?: string
          channel?: Database["public"]["Enums"]["notification_channel"]
          created_at?: string
          id?: string
          is_read?: boolean
          metadata?: Json
          owner_id?: string
          platform?: Database["public"]["Enums"]["notification_platform"]
          reference_id?: string | null
          reference_type?: string | null
          title?: string
          type?: Database["public"]["Enums"]["notification_type"]
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "owners"
            referencedColumns: ["id"]
          },
        ]
      }
      owner_relationships: {
        Row: {
          created_at: string
          id: string
          notes: string | null
          requester_id: string
          status: Database["public"]["Enums"]["relationship_status"]
          target_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          notes?: string | null
          requester_id: string
          status?: Database["public"]["Enums"]["relationship_status"]
          target_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string | null
          requester_id?: string
          status?: Database["public"]["Enums"]["relationship_status"]
          target_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "owner_relationships_requester_id_fkey"
            columns: ["requester_id"]
            isOneToOne: false
            referencedRelation: "owners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "owner_relationships_target_id_fkey"
            columns: ["target_id"]
            isOneToOne: false
            referencedRelation: "owners"
            referencedColumns: ["id"]
          },
        ]
      }
      owner_transfer_items: {
        Row: {
          id: string
          notes: string | null
          owner_transfer_id: string
          product_id: string
          qty_received: number | null
          qty_sent: number
          unit_cost: number | null
          unit_price: number
        }
        Insert: {
          id?: string
          notes?: string | null
          owner_transfer_id: string
          product_id: string
          qty_received?: number | null
          qty_sent: number
          unit_cost?: number | null
          unit_price: number
        }
        Update: {
          id?: string
          notes?: string | null
          owner_transfer_id?: string
          product_id?: string
          qty_received?: number | null
          qty_sent?: number
          unit_cost?: number | null
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "owner_transfer_items_owner_transfer_id_fkey"
            columns: ["owner_transfer_id"]
            isOneToOne: false
            referencedRelation: "owner_transfers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "owner_transfer_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      owner_transfers: {
        Row: {
          agreed_price: number | null
          buyer_owner_id: string
          created_at: string
          created_by: string | null
          currency: Database["public"]["Enums"]["currency_code"]
          from_branch_id: string
          id: string
          notes: string | null
          received_at: string | null
          received_by: string | null
          seller_owner_id: string
          sent_at: string | null
          status: Database["public"]["Enums"]["owner_transfer_status"]
          to_branch_id: string
          updated_at: string
        }
        Insert: {
          agreed_price?: number | null
          buyer_owner_id: string
          created_at?: string
          created_by?: string | null
          currency?: Database["public"]["Enums"]["currency_code"]
          from_branch_id: string
          id?: string
          notes?: string | null
          received_at?: string | null
          received_by?: string | null
          seller_owner_id: string
          sent_at?: string | null
          status?: Database["public"]["Enums"]["owner_transfer_status"]
          to_branch_id: string
          updated_at?: string
        }
        Update: {
          agreed_price?: number | null
          buyer_owner_id?: string
          created_at?: string
          created_by?: string | null
          currency?: Database["public"]["Enums"]["currency_code"]
          from_branch_id?: string
          id?: string
          notes?: string | null
          received_at?: string | null
          received_by?: string | null
          seller_owner_id?: string
          sent_at?: string | null
          status?: Database["public"]["Enums"]["owner_transfer_status"]
          to_branch_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "owner_transfers_buyer_owner_id_fkey"
            columns: ["buyer_owner_id"]
            isOneToOne: false
            referencedRelation: "owners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "owner_transfers_from_branch_id_fkey"
            columns: ["from_branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "owner_transfers_from_branch_id_fkey"
            columns: ["from_branch_id"]
            isOneToOne: false
            referencedRelation: "v_company_users"
            referencedColumns: ["branch_id"]
          },
          {
            foreignKeyName: "owner_transfers_from_branch_id_fkey"
            columns: ["from_branch_id"]
            isOneToOne: false
            referencedRelation: "v_current_user"
            referencedColumns: ["branch_id"]
          },
          {
            foreignKeyName: "owner_transfers_from_branch_id_fkey"
            columns: ["from_branch_id"]
            isOneToOne: false
            referencedRelation: "v_users_full"
            referencedColumns: ["branch_id"]
          },
          {
            foreignKeyName: "owner_transfers_from_branch_id_fkey"
            columns: ["from_branch_id"]
            isOneToOne: false
            referencedRelation: "vw_branch_inventory_summary"
            referencedColumns: ["branch_id"]
          },
          {
            foreignKeyName: "owner_transfers_seller_owner_id_fkey"
            columns: ["seller_owner_id"]
            isOneToOne: false
            referencedRelation: "owners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "owner_transfers_to_branch_id_fkey"
            columns: ["to_branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "owner_transfers_to_branch_id_fkey"
            columns: ["to_branch_id"]
            isOneToOne: false
            referencedRelation: "v_company_users"
            referencedColumns: ["branch_id"]
          },
          {
            foreignKeyName: "owner_transfers_to_branch_id_fkey"
            columns: ["to_branch_id"]
            isOneToOne: false
            referencedRelation: "v_current_user"
            referencedColumns: ["branch_id"]
          },
          {
            foreignKeyName: "owner_transfers_to_branch_id_fkey"
            columns: ["to_branch_id"]
            isOneToOne: false
            referencedRelation: "v_users_full"
            referencedColumns: ["branch_id"]
          },
          {
            foreignKeyName: "owner_transfers_to_branch_id_fkey"
            columns: ["to_branch_id"]
            isOneToOne: false
            referencedRelation: "vw_branch_inventory_summary"
            referencedColumns: ["branch_id"]
          },
        ]
      }
      owners: {
        Row: {
          business_name: string
          created_at: string
          email: string
          id: string
          is_active: boolean
          logo_url: string | null
          name: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          business_name: string
          created_at?: string
          email: string
          id?: string
          is_active?: boolean
          logo_url?: string | null
          name: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          business_name?: string
          created_at?: string
          email?: string
          id?: string
          is_active?: boolean
          logo_url?: string | null
          name?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      product_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          is_system: boolean
          name: string
          owner_id: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          is_system?: boolean
          name: string
          owner_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          is_system?: boolean
          name?: string
          owner_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_categories_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "owners"
            referencedColumns: ["id"]
          },
        ]
      }
      product_units: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          is_system: boolean
          label: string
          name: string
          owner_id: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          is_system?: boolean
          label: string
          name: string
          owner_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          is_system?: boolean
          label?: string
          name?: string
          owner_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_units_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "owners"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category_id: string
          cost_price: number | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean
          min_stock_alert: number
          name: string
          owner_id: string
          sale_price: number | null
          sku: string | null
          unit_id: string
          updated_at: string
        }
        Insert: {
          category_id: string
          cost_price?: number | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          min_stock_alert?: number
          name: string
          owner_id: string
          sale_price?: number | null
          sku?: string | null
          unit_id: string
          updated_at?: string
        }
        Update: {
          category_id?: string
          cost_price?: number | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          min_stock_alert?: number
          name?: string
          owner_id?: string
          sale_price?: number | null
          sku?: string | null
          unit_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "product_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "vw_inventory_full"
            referencedColumns: ["category_id"]
          },
          {
            foreignKeyName: "products_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "owners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "product_units"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "vw_inventory_full"
            referencedColumns: ["unit_id"]
          },
        ]
      }
      stock_alerts: {
        Row: {
          branch_id: string
          id: string
          notified_at: string
          owner_id: string
          product_id: string
          quantity: number
          resolved_at: string | null
          resolved_by: string | null
          status: Database["public"]["Enums"]["alert_status"]
          threshold: number
        }
        Insert: {
          branch_id: string
          id?: string
          notified_at?: string
          owner_id: string
          product_id: string
          quantity: number
          resolved_at?: string | null
          resolved_by?: string | null
          status?: Database["public"]["Enums"]["alert_status"]
          threshold: number
        }
        Update: {
          branch_id?: string
          id?: string
          notified_at?: string
          owner_id?: string
          product_id?: string
          quantity?: number
          resolved_at?: string | null
          resolved_by?: string | null
          status?: Database["public"]["Enums"]["alert_status"]
          threshold?: number
        }
        Relationships: [
          {
            foreignKeyName: "stock_alerts_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_alerts_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "v_company_users"
            referencedColumns: ["branch_id"]
          },
          {
            foreignKeyName: "stock_alerts_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "v_current_user"
            referencedColumns: ["branch_id"]
          },
          {
            foreignKeyName: "stock_alerts_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "v_users_full"
            referencedColumns: ["branch_id"]
          },
          {
            foreignKeyName: "stock_alerts_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "vw_branch_inventory_summary"
            referencedColumns: ["branch_id"]
          },
          {
            foreignKeyName: "stock_alerts_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "owners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_alerts_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      stock_movements: {
        Row: {
          branch_id: string
          created_at: string
          created_by: string | null
          id: string
          movement_type: Database["public"]["Enums"]["movement_type"]
          notes: string | null
          owner_id: string
          product_id: string
          quantity: number
          quantity_after: number | null
          quantity_before: number | null
          reference_id: string | null
          reference_type: string | null
          unit_cost: number | null
        }
        Insert: {
          branch_id: string
          created_at?: string
          created_by?: string | null
          id?: string
          movement_type: Database["public"]["Enums"]["movement_type"]
          notes?: string | null
          owner_id: string
          product_id: string
          quantity: number
          quantity_after?: number | null
          quantity_before?: number | null
          reference_id?: string | null
          reference_type?: string | null
          unit_cost?: number | null
        }
        Update: {
          branch_id?: string
          created_at?: string
          created_by?: string | null
          id?: string
          movement_type?: Database["public"]["Enums"]["movement_type"]
          notes?: string | null
          owner_id?: string
          product_id?: string
          quantity?: number
          quantity_after?: number | null
          quantity_before?: number | null
          reference_id?: string | null
          reference_type?: string | null
          unit_cost?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "stock_movements_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_movements_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "v_company_users"
            referencedColumns: ["branch_id"]
          },
          {
            foreignKeyName: "stock_movements_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "v_current_user"
            referencedColumns: ["branch_id"]
          },
          {
            foreignKeyName: "stock_movements_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "v_users_full"
            referencedColumns: ["branch_id"]
          },
          {
            foreignKeyName: "stock_movements_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "vw_branch_inventory_summary"
            referencedColumns: ["branch_id"]
          },
          {
            foreignKeyName: "stock_movements_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "owners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_movements_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      system_admins: {
        Row: {
          created_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      transfer_items: {
        Row: {
          id: string
          notes: string | null
          product_id: string
          qty_received: number | null
          qty_sent: number
          transfer_id: string
          unit_cost: number | null
        }
        Insert: {
          id?: string
          notes?: string | null
          product_id: string
          qty_received?: number | null
          qty_sent: number
          transfer_id: string
          unit_cost?: number | null
        }
        Update: {
          id?: string
          notes?: string | null
          product_id?: string
          qty_received?: number | null
          qty_sent?: number
          transfer_id?: string
          unit_cost?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "transfer_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transfer_items_transfer_id_fkey"
            columns: ["transfer_id"]
            isOneToOne: false
            referencedRelation: "transfers"
            referencedColumns: ["id"]
          },
        ]
      }
      transfers: {
        Row: {
          created_at: string
          created_by: string | null
          from_branch_id: string | null
          id: string
          notes: string | null
          owner_id: string
          received_at: string | null
          received_by: string | null
          sent_at: string | null
          status: Database["public"]["Enums"]["transfer_status"]
          to_branch_id: string
          transfer_type: Database["public"]["Enums"]["transfer_type"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          from_branch_id?: string | null
          id?: string
          notes?: string | null
          owner_id: string
          received_at?: string | null
          received_by?: string | null
          sent_at?: string | null
          status?: Database["public"]["Enums"]["transfer_status"]
          to_branch_id: string
          transfer_type: Database["public"]["Enums"]["transfer_type"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          from_branch_id?: string | null
          id?: string
          notes?: string | null
          owner_id?: string
          received_at?: string | null
          received_by?: string | null
          sent_at?: string | null
          status?: Database["public"]["Enums"]["transfer_status"]
          to_branch_id?: string
          transfer_type?: Database["public"]["Enums"]["transfer_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "transfers_from_branch_id_fkey"
            columns: ["from_branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transfers_from_branch_id_fkey"
            columns: ["from_branch_id"]
            isOneToOne: false
            referencedRelation: "v_company_users"
            referencedColumns: ["branch_id"]
          },
          {
            foreignKeyName: "transfers_from_branch_id_fkey"
            columns: ["from_branch_id"]
            isOneToOne: false
            referencedRelation: "v_current_user"
            referencedColumns: ["branch_id"]
          },
          {
            foreignKeyName: "transfers_from_branch_id_fkey"
            columns: ["from_branch_id"]
            isOneToOne: false
            referencedRelation: "v_users_full"
            referencedColumns: ["branch_id"]
          },
          {
            foreignKeyName: "transfers_from_branch_id_fkey"
            columns: ["from_branch_id"]
            isOneToOne: false
            referencedRelation: "vw_branch_inventory_summary"
            referencedColumns: ["branch_id"]
          },
          {
            foreignKeyName: "transfers_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "owners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transfers_to_branch_id_fkey"
            columns: ["to_branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transfers_to_branch_id_fkey"
            columns: ["to_branch_id"]
            isOneToOne: false
            referencedRelation: "v_company_users"
            referencedColumns: ["branch_id"]
          },
          {
            foreignKeyName: "transfers_to_branch_id_fkey"
            columns: ["to_branch_id"]
            isOneToOne: false
            referencedRelation: "v_current_user"
            referencedColumns: ["branch_id"]
          },
          {
            foreignKeyName: "transfers_to_branch_id_fkey"
            columns: ["to_branch_id"]
            isOneToOne: false
            referencedRelation: "v_users_full"
            referencedColumns: ["branch_id"]
          },
          {
            foreignKeyName: "transfers_to_branch_id_fkey"
            columns: ["to_branch_id"]
            isOneToOne: false
            referencedRelation: "vw_branch_inventory_summary"
            referencedColumns: ["branch_id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          avatar_url: string | null
          branch_id: string | null
          created_at: string
          id: string
          is_active: boolean
          name: string
          owner_id: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          branch_id?: string | null
          created_at?: string
          id: string
          is_active?: boolean
          name: string
          owner_id?: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          branch_id?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          owner_id?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_profiles_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "v_company_users"
            referencedColumns: ["branch_id"]
          },
          {
            foreignKeyName: "user_profiles_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "v_current_user"
            referencedColumns: ["branch_id"]
          },
          {
            foreignKeyName: "user_profiles_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "v_users_full"
            referencedColumns: ["branch_id"]
          },
          {
            foreignKeyName: "user_profiles_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "vw_branch_inventory_summary"
            referencedColumns: ["branch_id"]
          },
          {
            foreignKeyName: "user_profiles_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "owners"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      v_company_users: {
        Row: {
          avatar_url: string | null
          branch_id: string | null
          branch_name: string | null
          business_name: string | null
          email: string | null
          is_active: boolean | null
          logo_url: string | null
          name: string | null
          owner_id: string | null
          role: Database["public"]["Enums"]["user_role"] | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "owners"
            referencedColumns: ["id"]
          },
        ]
      }
      v_current_user: {
        Row: {
          avatar_url: string | null
          branch_id: string | null
          branch_name: string | null
          business_name: string | null
          email: string | null
          is_active: boolean | null
          is_owner: boolean | null
          is_root: boolean | null
          logo_url: string | null
          name: string | null
          owner_id: string | null
          role: Database["public"]["Enums"]["user_role"] | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "owners"
            referencedColumns: ["id"]
          },
        ]
      }
      v_users_full: {
        Row: {
          avatar_url: string | null
          branch_id: string | null
          branch_name: string | null
          business_name: string | null
          email: string | null
          is_active: boolean | null
          is_owner: boolean | null
          is_root: boolean | null
          logo_url: string | null
          name: string | null
          owner_id: string | null
          role: Database["public"]["Enums"]["user_role"] | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "owners"
            referencedColumns: ["id"]
          },
        ]
      }
      vw_active_alerts: {
        Row: {
          branch_id: string | null
          branch_name: string | null
          branch_type: Database["public"]["Enums"]["branch_type"] | null
          category_name: string | null
          current_qty: number | null
          description: string | null
          id: string | null
          notified_at: string | null
          owner_id: string | null
          product_id: string | null
          product_name: string | null
          status: Database["public"]["Enums"]["alert_status"] | null
          threshold: number | null
          units_below_threshold: number | null
        }
        Relationships: [
          {
            foreignKeyName: "stock_alerts_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_alerts_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "v_company_users"
            referencedColumns: ["branch_id"]
          },
          {
            foreignKeyName: "stock_alerts_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "v_current_user"
            referencedColumns: ["branch_id"]
          },
          {
            foreignKeyName: "stock_alerts_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "v_users_full"
            referencedColumns: ["branch_id"]
          },
          {
            foreignKeyName: "stock_alerts_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "vw_branch_inventory_summary"
            referencedColumns: ["branch_id"]
          },
          {
            foreignKeyName: "stock_alerts_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "owners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_alerts_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      vw_branch_inventory_summary: {
        Row: {
          branch_id: string | null
          branch_name: string | null
          branch_type: Database["public"]["Enums"]["branch_type"] | null
          low_stock_count: number | null
          out_of_stock_count: number | null
          owner_id: string | null
          total_products: number | null
          total_stock_value: number | null
        }
        Relationships: [
          {
            foreignKeyName: "branches_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "owners"
            referencedColumns: ["id"]
          },
        ]
      }
      vw_inventory_full: {
        Row: {
          branch_id: string | null
          branch_name: string | null
          branch_type: Database["public"]["Enums"]["branch_type"] | null
          category_id: string | null
          category_name: string | null
          cost_price: number | null
          description: string | null
          id: string | null
          min_stock_alert: number | null
          owner_id: string | null
          product_id: string | null
          product_name: string | null
          quantity: number | null
          sale_price: number | null
          sku: string | null
          stock_status: Database["public"]["Enums"]["stock_status"] | null
          stock_value: number | null
          unit_id: string | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "v_company_users"
            referencedColumns: ["branch_id"]
          },
          {
            foreignKeyName: "inventory_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "v_current_user"
            referencedColumns: ["branch_id"]
          },
          {
            foreignKeyName: "inventory_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "v_users_full"
            referencedColumns: ["branch_id"]
          },
          {
            foreignKeyName: "inventory_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "vw_branch_inventory_summary"
            referencedColumns: ["branch_id"]
          },
          {
            foreignKeyName: "inventory_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "owners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      vw_transfer_items_full: {
        Row: {
          category_name: string | null
          description: string | null
          from_branch_id: string | null
          id: string | null
          line_total: number | null
          owner_id: string | null
          product_id: string | null
          product_name: string | null
          qty_difference: number | null
          qty_received: number | null
          qty_sent: number | null
          to_branch_id: string | null
          transfer_id: string | null
          transfer_status: Database["public"]["Enums"]["transfer_status"] | null
          unit_cost: number | null
        }
        Relationships: [
          {
            foreignKeyName: "transfer_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transfer_items_transfer_id_fkey"
            columns: ["transfer_id"]
            isOneToOne: false
            referencedRelation: "transfers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transfers_from_branch_id_fkey"
            columns: ["from_branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transfers_from_branch_id_fkey"
            columns: ["from_branch_id"]
            isOneToOne: false
            referencedRelation: "v_company_users"
            referencedColumns: ["branch_id"]
          },
          {
            foreignKeyName: "transfers_from_branch_id_fkey"
            columns: ["from_branch_id"]
            isOneToOne: false
            referencedRelation: "v_current_user"
            referencedColumns: ["branch_id"]
          },
          {
            foreignKeyName: "transfers_from_branch_id_fkey"
            columns: ["from_branch_id"]
            isOneToOne: false
            referencedRelation: "v_users_full"
            referencedColumns: ["branch_id"]
          },
          {
            foreignKeyName: "transfers_from_branch_id_fkey"
            columns: ["from_branch_id"]
            isOneToOne: false
            referencedRelation: "vw_branch_inventory_summary"
            referencedColumns: ["branch_id"]
          },
          {
            foreignKeyName: "transfers_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "owners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transfers_to_branch_id_fkey"
            columns: ["to_branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transfers_to_branch_id_fkey"
            columns: ["to_branch_id"]
            isOneToOne: false
            referencedRelation: "v_company_users"
            referencedColumns: ["branch_id"]
          },
          {
            foreignKeyName: "transfers_to_branch_id_fkey"
            columns: ["to_branch_id"]
            isOneToOne: false
            referencedRelation: "v_current_user"
            referencedColumns: ["branch_id"]
          },
          {
            foreignKeyName: "transfers_to_branch_id_fkey"
            columns: ["to_branch_id"]
            isOneToOne: false
            referencedRelation: "v_users_full"
            referencedColumns: ["branch_id"]
          },
          {
            foreignKeyName: "transfers_to_branch_id_fkey"
            columns: ["to_branch_id"]
            isOneToOne: false
            referencedRelation: "vw_branch_inventory_summary"
            referencedColumns: ["branch_id"]
          },
        ]
      }
      vw_unread_notifications: {
        Row: {
          body: string | null
          channel: Database["public"]["Enums"]["notification_channel"] | null
          created_at: string | null
          id: string | null
          metadata: Json | null
          owner_id: string | null
          platform: Database["public"]["Enums"]["notification_platform"] | null
          reference_id: string | null
          reference_type: string | null
          title: string | null
          type: Database["public"]["Enums"]["notification_type"] | null
          user_id: string | null
        }
        Insert: {
          body?: string | null
          channel?: Database["public"]["Enums"]["notification_channel"] | null
          created_at?: string | null
          id?: string | null
          metadata?: Json | null
          owner_id?: string | null
          platform?: Database["public"]["Enums"]["notification_platform"] | null
          reference_id?: string | null
          reference_type?: string | null
          title?: string | null
          type?: Database["public"]["Enums"]["notification_type"] | null
          user_id?: string | null
        }
        Update: {
          body?: string | null
          channel?: Database["public"]["Enums"]["notification_channel"] | null
          created_at?: string | null
          id?: string | null
          metadata?: Json | null
          owner_id?: string | null
          platform?: Database["public"]["Enums"]["notification_platform"] | null
          reference_id?: string | null
          reference_type?: string | null
          title?: string | null
          type?: Database["public"]["Enums"]["notification_type"] | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "owners"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      adjust_inventory: {
        Args: {
          p_branch_id: string
          p_new_qty: number
          p_notes: string
          p_owner_id: string
          p_product_id: string
          p_user_id: string
        }
        Returns: Json
      }
      confirm_transfer_received: {
        Args: { p_received: Json; p_transfer_id: string; p_user_id: string }
        Returns: Json
      }
      confirm_transfer_sent: {
        Args: { p_transfer_id: string; p_user_id: string }
        Returns: Json
      }
      get_my_branch_id: { Args: never; Returns: string }
      get_my_owner_id: { Args: never; Returns: string }
      get_my_role: { Args: never; Returns: string }
      record_stock_movement: {
        Args: {
          p_branch_id: string
          p_created_by: string
          p_movement_type: Database["public"]["Enums"]["movement_type"]
          p_notes: string
          p_owner_id: string
          p_product_id: string
          p_quantity: number
          p_reference_id: string
          p_reference_type: string
          p_unit_cost: number
        }
        Returns: undefined
      }
      register_purchase: {
        Args: {
          p_branch_id: string
          p_items: Json
          p_notes: string
          p_owner_id: string
          p_user_id: string
        }
        Returns: Json
      }
    }
    Enums: {
      alert_status: "active" | "resolved" | "snoozed"
      branch_type: "warehouse" | "point_of_sale"
      currency_code: "MXN" | "USD"
      movement_type:
        | "in_transfer"
        | "out_transfer"
        | "in_purchase"
        | "out_sale"
        | "adjustment_in"
        | "adjustment_out"
        | "waste"
        | "production_in"
        | "production_out"
      notification_channel: "in_app" | "push" | "email"
      notification_platform: "web" | "mobile" | "all"
      notification_type:
        | "low_stock"
        | "transfer_sent"
        | "transfer_received"
        | "transfer_partial"
        | "transfer_cancelled"
        | "owner_transfer_sent"
        | "owner_transfer_received"
        | "owner_transfer_partial"
        | "owner_transfer_cancelled"
        | "owner_relationship_invite"
        | "owner_relationship_active"
      owner_transfer_status:
        | "pending"
        | "in_transit"
        | "received"
        | "partial"
        | "cancelled"
      relationship_status: "pending" | "active" | "suspended"
      stock_status: "ok" | "low" | "out_of_stock"
      transfer_status:
        | "pending"
        | "in_transit"
        | "received"
        | "partial"
        | "cancelled"
      transfer_type: "supply" | "inter_branch" | "purchase" | "return"
      user_role: "owner" | "manager" | "warehouse" | "branch_staff"
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
  public: {
    Enums: {
      alert_status: ["active", "resolved", "snoozed"],
      branch_type: ["warehouse", "point_of_sale"],
      currency_code: ["MXN", "USD"],
      movement_type: [
        "in_transfer",
        "out_transfer",
        "in_purchase",
        "out_sale",
        "adjustment_in",
        "adjustment_out",
        "waste",
        "production_in",
        "production_out",
      ],
      notification_channel: ["in_app", "push", "email"],
      notification_platform: ["web", "mobile", "all"],
      notification_type: [
        "low_stock",
        "transfer_sent",
        "transfer_received",
        "transfer_partial",
        "transfer_cancelled",
        "owner_transfer_sent",
        "owner_transfer_received",
        "owner_transfer_partial",
        "owner_transfer_cancelled",
        "owner_relationship_invite",
        "owner_relationship_active",
      ],
      owner_transfer_status: [
        "pending",
        "in_transit",
        "received",
        "partial",
        "cancelled",
      ],
      relationship_status: ["pending", "active", "suspended"],
      stock_status: ["ok", "low", "out_of_stock"],
      transfer_status: [
        "pending",
        "in_transit",
        "received",
        "partial",
        "cancelled",
      ],
      transfer_type: ["supply", "inter_branch", "purchase", "return"],
      user_role: ["owner", "manager", "warehouse", "branch_staff"],
    },
  },
} as const
