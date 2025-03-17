export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      comments: {
        Row: {
          content: string
          created_at: string | null
          id: string
          prompt_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          prompt_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          prompt_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_prompt_id_fkey"
            columns: ["prompt_id"]
            isOneToOne: false
            referencedRelation: "prompts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_user_id_fkey_profiles"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      likes: {
        Row: {
          created_at: string | null
          id: string
          prompt_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          prompt_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          prompt_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "likes_prompt_id_fkey"
            columns: ["prompt_id"]
            isOneToOne: false
            referencedRelation: "prompts"
            referencedColumns: ["id"]
          },
        ]
      }
      main_buttons: {
        Row: {
          created_at: string | null
          description: string | null
          icon: string
          id: string
          link: string
          name: string
          order_index: number
          status: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          icon: string
          id?: string
          link: string
          name: string
          order_index?: number
          status?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          icon?: string
          id?: string
          link?: string
          name?: string
          order_index?: number
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      products: {
        Row: {
          created_at: string | null
          id: string
          image: string
          name: string
          order_index: number
          price: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          image: string
          name: string
          order_index?: number
          price: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          image?: string
          name?: string
          order_index?: number
          price?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string
          email_confirmed: boolean | null
          full_name: string
          updated_at: string | null
          user_id: string
          username: string
        }
        Insert: {
          created_at?: string | null
          email: string
          email_confirmed?: boolean | null
          full_name: string
          updated_at?: string | null
          user_id: string
          username: string
        }
        Update: {
          created_at?: string | null
          email?: string
          email_confirmed?: boolean | null
          full_name?: string
          updated_at?: string | null
          user_id?: string
          username?: string
        }
        Relationships: []
      }
      prompts: {
        Row: {
          categories: string[] | null
          category: string | null
          comments_count: number | null
          content: string
          created_at: string | null
          description: string | null
          example_link: string | null
          id: string
          is_editable: boolean | null
          likes_count: number | null
          privacy: string | null
          shares_count: number | null
          tags: string[] | null
          title: string
          updated_at: string | null
          user_id: string
          views_count: number | null
        }
        Insert: {
          categories?: string[] | null
          category?: string | null
          comments_count?: number | null
          content: string
          created_at?: string | null
          description?: string | null
          example_link?: string | null
          id?: string
          is_editable?: boolean | null
          likes_count?: number | null
          privacy?: string | null
          shares_count?: number | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          user_id: string
          views_count?: number | null
        }
        Update: {
          categories?: string[] | null
          category?: string | null
          comments_count?: number | null
          content?: string
          created_at?: string | null
          description?: string | null
          example_link?: string | null
          id?: string
          is_editable?: boolean | null
          likes_count?: number | null
          privacy?: string | null
          shares_count?: number | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          user_id?: string
          views_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "prompts_user_id_fkey_profiles"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      saved_prompts: {
        Row: {
          created_at: string | null
          id: string
          prompt_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          prompt_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          prompt_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_prompts_prompt_id_fkey"
            columns: ["prompt_id"]
            isOneToOne: false
            referencedRelation: "prompts"
            referencedColumns: ["id"]
          },
        ]
      }
      shares: {
        Row: {
          created_at: string | null
          id: string
          platform: string | null
          prompt_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          platform?: string | null
          prompt_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          platform?: string | null
          prompt_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "shares_prompt_id_fkey"
            columns: ["prompt_id"]
            isOneToOne: false
            referencedRelation: "prompts"
            referencedColumns: ["id"]
          },
        ]
      }
      store_settings: {
        Row: {
          address: string | null
          created_at: string | null
          description: string | null
          id: string
          instagram_handle: string | null
          open_saturday: boolean | null
          open_sunday: boolean | null
          open_weekdays: boolean | null
          saturday_close_time: string | null
          saturday_open_time: string | null
          store_image: string
          store_name: string
          sunday_close_time: string | null
          sunday_open_time: string | null
          updated_at: string | null
          weekday_close_time: string | null
          weekday_open_time: string | null
          whatsapp_number: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          instagram_handle?: string | null
          open_saturday?: boolean | null
          open_sunday?: boolean | null
          open_weekdays?: boolean | null
          saturday_close_time?: string | null
          saturday_open_time?: string | null
          store_image?: string
          store_name?: string
          sunday_close_time?: string | null
          sunday_open_time?: string | null
          updated_at?: string | null
          weekday_close_time?: string | null
          weekday_open_time?: string | null
          whatsapp_number?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          instagram_handle?: string | null
          open_saturday?: boolean | null
          open_sunday?: boolean | null
          open_weekdays?: boolean | null
          saturday_close_time?: string | null
          saturday_open_time?: string | null
          store_image?: string
          store_name?: string
          sunday_close_time?: string | null
          sunday_open_time?: string | null
          updated_at?: string | null
          weekday_close_time?: string | null
          weekday_open_time?: string | null
          whatsapp_number?: string | null
        }
        Relationships: []
      }
      verification_codes: {
        Row: {
          code: string
          created_at: string | null
          expires_at: string
          id: string
          user_id: string
        }
        Insert: {
          code: string
          created_at?: string | null
          expires_at: string
          id?: string
          user_id: string
        }
        Update: {
          code?: string
          created_at?: string | null
          expires_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_views: {
        Args: {
          prompt_id: string
        }
        Returns: undefined
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
