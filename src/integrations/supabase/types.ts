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
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string
          id: string
          password_hash: string
          username: string
        }
        Insert: {
          created_at?: string
          id?: string
          password_hash: string
          username: string
        }
        Update: {
          created_at?: string
          id?: string
          password_hash?: string
          username?: string
        }
        Relationships: []
      }
      inquiries: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          phone: string
          status: string
          subject: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          phone?: string
          status?: string
          subject?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string
          status?: string
          subject?: string
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          image: string | null
          order_id: string
          quantity: number
          unit_price: number
          vehicle_id: string | null
          vehicle_name: string
          vehicle_slug: string
        }
        Insert: {
          created_at?: string
          id?: string
          image?: string | null
          order_id: string
          quantity?: number
          unit_price?: number
          vehicle_id?: string | null
          vehicle_name: string
          vehicle_slug?: string
        }
        Update: {
          created_at?: string
          id?: string
          image?: string | null
          order_id?: string
          quantity?: number
          unit_price?: number
          vehicle_id?: string | null
          vehicle_name?: string
          vehicle_slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          address: string
          city: string
          country: string
          created_at: string
          email: string
          full_name: string
          id: string
          notes: string
          order_number: string
          payment_method: string
          phone: string
          postcode: string
          state: string
          status: string
          total: number
        }
        Insert: {
          address?: string
          city?: string
          country?: string
          created_at?: string
          email: string
          full_name: string
          id?: string
          notes?: string
          order_number?: string
          payment_method?: string
          phone?: string
          postcode?: string
          state?: string
          status?: string
          total?: number
        }
        Update: {
          address?: string
          city?: string
          country?: string
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          notes?: string
          order_number?: string
          payment_method?: string
          phone?: string
          postcode?: string
          state?: string
          status?: string
          total?: number
        }
        Relationships: []
      }
      posts: {
        Row: {
          author: string
          category: string
          content: string
          cover_image: string | null
          created_at: string
          excerpt: string
          id: string
          is_published: boolean
          keywords: string[]
          meta_description: string | null
          meta_title: string | null
          published_at: string
          read_minutes: number
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          author?: string
          category?: string
          content?: string
          cover_image?: string | null
          created_at?: string
          excerpt?: string
          id?: string
          is_published?: boolean
          keywords?: string[]
          meta_description?: string | null
          meta_title?: string | null
          published_at?: string
          read_minutes?: number
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          author?: string
          category?: string
          content?: string
          cover_image?: string | null
          created_at?: string
          excerpt?: string
          id?: string
          is_published?: boolean
          keywords?: string[]
          meta_description?: string | null
          meta_title?: string | null
          published_at?: string
          read_minutes?: number
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          body: string
          created_at: string
          id: string
          location: string
          name: string
          rating: number
          sort_order: number
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          location?: string
          name: string
          rating?: number
          sort_order?: number
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          location?: string
          name?: string
          rating?: number
          sort_order?: number
        }
        Relationships: []
      }
      vehicles: {
        Row: {
          body_type: string | null
          created_at: string
          description: string
          exterior_color: string | null
          fuel_type: string | null
          id: string
          images: string[]
          interior_color: string | null
          is_featured: boolean
          is_hot_deal: boolean
          is_sold: boolean
          make: string | null
          mileage: string | null
          name: string
          price: number
          sale_price: number | null
          slug: string
          sort_order: number
          title_status: string | null
          transmission: string | null
          trim: string | null
          updated_at: string
          year: number | null
        }
        Insert: {
          body_type?: string | null
          created_at?: string
          description?: string
          exterior_color?: string | null
          fuel_type?: string | null
          id?: string
          images?: string[]
          interior_color?: string | null
          is_featured?: boolean
          is_hot_deal?: boolean
          is_sold?: boolean
          make?: string | null
          mileage?: string | null
          name: string
          price?: number
          sale_price?: number | null
          slug: string
          sort_order?: number
          title_status?: string | null
          transmission?: string | null
          trim?: string | null
          updated_at?: string
          year?: number | null
        }
        Update: {
          body_type?: string | null
          created_at?: string
          description?: string
          exterior_color?: string | null
          fuel_type?: string | null
          id?: string
          images?: string[]
          interior_color?: string | null
          is_featured?: boolean
          is_hot_deal?: boolean
          is_sold?: boolean
          make?: string | null
          mileage?: string | null
          name?: string
          price?: number
          sale_price?: number | null
          slug?: string
          sort_order?: number
          title_status?: string | null
          transmission?: string | null
          trim?: string | null
          updated_at?: string
          year?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      verify_admin_login: {
        Args: { _password: string; _username: string }
        Returns: {
          id: string
          username: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
