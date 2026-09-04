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
      admin_settings: {
        Row: {
          id: string
          setting_key: string
          setting_value: string
          updated_at: string
        }
        Insert: {
          id?: string
          setting_key: string
          setting_value: string
          updated_at?: string
        }
        Update: {
          id?: string
          setting_key?: string
          setting_value?: string
          updated_at?: string
        }
        Relationships: []
      }
      coupon_sends: {
        Row: {
          coupon_id: string | null
          full_name: string | null
          id: string
          phone: string | null
          sent_at: string
          user_id: string | null
        }
        Insert: {
          coupon_id?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          sent_at?: string
          user_id?: string | null
        }
        Update: {
          coupon_id?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          sent_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "coupon_sends_coupon_id_fkey"
            columns: ["coupon_id"]
            isOneToOne: false
            referencedRelation: "coupons"
            referencedColumns: ["id"]
          },
        ]
      }
      coupons: {
        Row: {
          active: boolean
          code: string
          created_at: string
          description: string | null
          discount_type: string
          discount_value: number
          expires_at: string | null
          id: string
          min_order: number
          product_id: string | null
        }
        Insert: {
          active?: boolean
          code: string
          created_at?: string
          description?: string | null
          discount_type: string
          discount_value: number
          expires_at?: string | null
          id?: string
          min_order?: number
          product_id?: string | null
        }
        Update: {
          active?: boolean
          code?: string
          created_at?: string
          description?: string | null
          discount_type?: string
          discount_value?: number
          expires_at?: string | null
          id?: string
          min_order?: number
          product_id?: string | null
        }
        Relationships: []
      }
      demo_requests: {
        Row: {
          company: string | null
          created_at: string
          email: string
          id: string
          image_paths: string[]
          message: string | null
          name: string
          phone: string
          service: string | null
          status: string
        }
        Insert: {
          company?: string | null
          created_at?: string
          email: string
          id?: string
          image_paths?: string[]
          message?: string | null
          name: string
          phone: string
          service?: string | null
          status?: string
        }
        Update: {
          company?: string | null
          created_at?: string
          email?: string
          id?: string
          image_paths?: string[]
          message?: string | null
          name?: string
          phone?: string
          service?: string | null
          status?: string
        }
        Relationships: []
      }
      meta_data_deletion_requests: {
        Row: {
          confirmation_code: string
          created_at: string
          id: string
          signed_request: string | null
          status: string
          user_id_meta: string | null
        }
        Insert: {
          confirmation_code: string
          created_at?: string
          id?: string
          signed_request?: string | null
          status?: string
          user_id_meta?: string | null
        }
        Update: {
          confirmation_code?: string
          created_at?: string
          id?: string
          signed_request?: string | null
          status?: string
          user_id_meta?: string | null
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          order_id: string
          product_id: string
          product_name: string
          quantity_grams: number
          total_price: number
          unit_price: number
        }
        Insert: {
          created_at?: string
          id?: string
          order_id: string
          product_id: string
          product_name: string
          quantity_grams: number
          total_price: number
          unit_price: number
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string
          product_id?: string
          product_name?: string
          quantity_grams?: number
          total_price?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          accepted_at: string | null
          coupon_code: string | null
          courier: string | null
          created_at: string
          customer_address: string
          customer_email: string | null
          customer_name: string
          customer_phone: string
          delivered_at: string | null
          discount_amount: number | null
          guest_email: string | null
          guest_token: string | null
          id: string
          invoice_number: string | null
          notes: string | null
          order_number: string
          packed_at: string | null
          shipped_at: string | null
          status: string
          total_amount: number
          tracking_number: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          accepted_at?: string | null
          coupon_code?: string | null
          courier?: string | null
          created_at?: string
          customer_address: string
          customer_email?: string | null
          customer_name: string
          customer_phone: string
          delivered_at?: string | null
          discount_amount?: number | null
          guest_email?: string | null
          guest_token?: string | null
          id?: string
          invoice_number?: string | null
          notes?: string | null
          order_number: string
          packed_at?: string | null
          shipped_at?: string | null
          status?: string
          total_amount?: number
          tracking_number?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          accepted_at?: string | null
          coupon_code?: string | null
          courier?: string | null
          created_at?: string
          customer_address?: string
          customer_email?: string | null
          customer_name?: string
          customer_phone?: string
          delivered_at?: string | null
          discount_amount?: number | null
          guest_email?: string | null
          guest_token?: string | null
          id?: string
          invoice_number?: string | null
          notes?: string | null
          order_number?: string
          packed_at?: string | null
          shipped_at?: string | null
          status?: string
          total_amount?: number
          tracking_number?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      page_views: {
        Row: {
          created_at: string
          id: string
          page_path: string
          referrer: string | null
          referrer_source: string | null
          user_agent: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          page_path: string
          referrer?: string | null
          referrer_source?: string | null
          user_agent?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          page_path?: string
          referrer?: string | null
          referrer_source?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      pending_signups: {
        Row: {
          attempts: number
          created_at: string
          email: string
          expires_at: string
          full_name: string
          id: string
          otp_code: string
          password: string
        }
        Insert: {
          attempts?: number
          created_at?: string
          email: string
          expires_at: string
          full_name: string
          id?: string
          otp_code: string
          password: string
        }
        Update: {
          attempts?: number
          created_at?: string
          email?: string
          expires_at?: string
          full_name?: string
          id?: string
          otp_code?: string
          password?: string
        }
        Relationships: []
      }
      product_feedback: {
        Row: {
          created_at: string
          delivery_rating: number | null
          id: string
          packaging_rating: number | null
          product_id: string
          product_quality: number | null
          rating: number
          review: string
          reviewer_location: string | null
          reviewer_name: string
        }
        Insert: {
          created_at?: string
          delivery_rating?: number | null
          id?: string
          packaging_rating?: number | null
          product_id: string
          product_quality?: number | null
          rating: number
          review: string
          reviewer_location?: string | null
          reviewer_name: string
        }
        Update: {
          created_at?: string
          delivery_rating?: number | null
          id?: string
          packaging_rating?: number | null
          product_id?: string
          product_quality?: number | null
          rating?: number
          review?: string
          reviewer_location?: string | null
          reviewer_name?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          city: string | null
          created_at: string
          full_name: string | null
          id: string
          permanent_address: string | null
          phone: string | null
          pincode: string | null
          state: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          city?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          permanent_address?: string | null
          phone?: string | null
          pincode?: string | null
          state?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          city?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          permanent_address?: string | null
          phone?: string | null
          pincode?: string | null
          state?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      site_content: {
        Row: {
          content_key: string
          content_type: string
          content_value: string
          created_at: string
          id: string
          image_url: string | null
          metadata: Json | null
          updated_at: string
        }
        Insert: {
          content_key: string
          content_type?: string
          content_value?: string
          created_at?: string
          id?: string
          image_url?: string | null
          metadata?: Json | null
          updated_at?: string
        }
        Update: {
          content_key?: string
          content_type?: string
          content_value?: string
          created_at?: string
          id?: string
          image_url?: string | null
          metadata?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      site_theme: {
        Row: {
          id: string
          theme_key: string
          theme_value: string
          updated_at: string
        }
        Insert: {
          id?: string
          theme_key: string
          theme_value?: string
          updated_at?: string
        }
        Update: {
          id?: string
          theme_key?: string
          theme_value?: string
          updated_at?: string
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
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
