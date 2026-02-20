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
  public: {
    Tables: {
      bookings: {
        Row: {
          check_in: string
          check_out: string
          cleaning_fee: number | null
          created_at: string
          guest_name: string | null
          id: string
          imported_from: string | null
          net_revenue: number | null
          nights: number | null
          notes: string | null
          platform_fee: number | null
          property_name: string
          revenue: number
          source: string
          status: string | null
          updated_at: string
        }
        Insert: {
          check_in: string
          check_out: string
          cleaning_fee?: number | null
          created_at?: string
          guest_name?: string | null
          id?: string
          imported_from?: string | null
          net_revenue?: number | null
          nights?: number | null
          notes?: string | null
          platform_fee?: number | null
          property_name: string
          revenue?: number
          source: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          check_in?: string
          check_out?: string
          cleaning_fee?: number | null
          created_at?: string
          guest_name?: string | null
          id?: string
          imported_from?: string | null
          net_revenue?: number | null
          nights?: number | null
          notes?: string | null
          platform_fee?: number | null
          property_name?: string
          revenue?: number
          source?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      hubspot_deals: {
        Row: {
          amount: number | null
          close_date: string | null
          company_name: string | null
          created_date: string | null
          days_in_stage: number | null
          deal_name: string
          hubspot_deal_id: string
          id: string
          last_modified: string | null
          owner_name: string | null
          pipeline: string | null
          properties: Json | null
          stage: string | null
          synced_at: string
        }
        Insert: {
          amount?: number | null
          close_date?: string | null
          company_name?: string | null
          created_date?: string | null
          days_in_stage?: number | null
          deal_name: string
          hubspot_deal_id: string
          id?: string
          last_modified?: string | null
          owner_name?: string | null
          pipeline?: string | null
          properties?: Json | null
          stage?: string | null
          synced_at?: string
        }
        Update: {
          amount?: number | null
          close_date?: string | null
          company_name?: string | null
          created_date?: string | null
          days_in_stage?: number | null
          deal_name?: string
          hubspot_deal_id?: string
          id?: string
          last_modified?: string | null
          owner_name?: string | null
          pipeline?: string | null
          properties?: Json | null
          stage?: string | null
          synced_at?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          business_unit: string | null
          created_at: string
          currency: string | null
          customer_email: string | null
          customer_name: string | null
          description: string | null
          external_id: string | null
          id: string
          metadata: Json | null
          payment_date: string
          source: string
        }
        Insert: {
          amount: number
          business_unit?: string | null
          created_at?: string
          currency?: string | null
          customer_email?: string | null
          customer_name?: string | null
          description?: string | null
          external_id?: string | null
          id?: string
          metadata?: Json | null
          payment_date?: string
          source?: string
        }
        Update: {
          amount?: number
          business_unit?: string | null
          created_at?: string
          currency?: string | null
          customer_email?: string | null
          customer_name?: string | null
          description?: string | null
          external_id?: string | null
          id?: string
          metadata?: Json | null
          payment_date?: string
          source?: string
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
