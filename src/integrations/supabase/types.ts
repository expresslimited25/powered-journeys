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
      app_config: {
        Row: {
          key: string
          updated_at: string
          value: string
        }
        Insert: {
          key: string
          updated_at?: string
          value: string
        }
        Update: {
          key?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      discover_posts: {
        Row: {
          country: string | null
          cover_image_url: string | null
          created_at: string
          days_count: number | null
          description: string | null
          destination: string | null
          id: string
          itinerary_id: string | null
          tags: string[]
          title: string
          user_id: string
        }
        Insert: {
          country?: string | null
          cover_image_url?: string | null
          created_at?: string
          days_count?: number | null
          description?: string | null
          destination?: string | null
          id?: string
          itinerary_id?: string | null
          tags?: string[]
          title: string
          user_id: string
        }
        Update: {
          country?: string | null
          cover_image_url?: string | null
          created_at?: string
          days_count?: number | null
          description?: string | null
          destination?: string | null
          id?: string
          itinerary_id?: string | null
          tags?: string[]
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "discover_posts_itinerary_id_fkey"
            columns: ["itinerary_id"]
            isOneToOne: false
            referencedRelation: "itineraries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "discover_posts_profile_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      generation_jobs: {
        Row: {
          attempts: number
          brief: Json
          brief_hash: string
          completed_at: string | null
          created_at: string
          error_message: string | null
          id: string
          itinerary_id: string | null
          max_attempts: number
          result: Json | null
          started_at: string | null
          status: string
          target_itinerary_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          attempts?: number
          brief: Json
          brief_hash: string
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          itinerary_id?: string | null
          max_attempts?: number
          result?: Json | null
          started_at?: string | null
          status?: string
          target_itinerary_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          attempts?: number
          brief?: Json
          brief_hash?: string
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          itinerary_id?: string | null
          max_attempts?: number
          result?: Json | null
          started_at?: string | null
          status?: string
          target_itinerary_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "generation_jobs_itinerary_id_fkey"
            columns: ["itinerary_id"]
            isOneToOne: false
            referencedRelation: "itineraries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "generation_jobs_target_itinerary_id_fkey"
            columns: ["target_itinerary_id"]
            isOneToOne: false
            referencedRelation: "itineraries"
            referencedColumns: ["id"]
          },
        ]
      }
      generation_usage: {
        Row: {
          daily_count: number
          daily_date: string
          last_used_at: string | null
          monthly_count: number
          monthly_date: string
          total_count: number
          user_id: string
        }
        Insert: {
          daily_count?: number
          daily_date?: string
          last_used_at?: string | null
          monthly_count?: number
          monthly_date?: string
          total_count?: number
          user_id: string
        }
        Update: {
          daily_count?: number
          daily_date?: string
          last_used_at?: string | null
          monthly_count?: number
          monthly_date?: string
          total_count?: number
          user_id?: string
        }
        Relationships: []
      }
      itineraries: {
        Row: {
          budget_range: string | null
          created_at: string
          destination: string
          end_date: string | null
          id: string
          interests: string[]
          is_public: boolean
          itinerary_data: Json
          pax_adults: number
          pax_children: number
          share_token: string
          start_date: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          budget_range?: string | null
          created_at?: string
          destination: string
          end_date?: string | null
          id?: string
          interests?: string[]
          is_public?: boolean
          itinerary_data?: Json
          pax_adults?: number
          pax_children?: number
          share_token?: string
          start_date?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          budget_range?: string | null
          created_at?: string
          destination?: string
          end_date?: string | null
          id?: string
          interests?: string[]
          is_public?: boolean
          itinerary_data?: Json
          pax_adults?: number
          pax_children?: number
          share_token?: string
          start_date?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      itinerary_cache: {
        Row: {
          brief_hash: string
          budget_range: string | null
          created_at: string
          destination: string
          end_date: string | null
          expires_at: string
          hit_count: number
          interests: string[]
          itinerary_data: Json
          pax_adults: number
          pax_children: number
          start_date: string | null
        }
        Insert: {
          brief_hash: string
          budget_range?: string | null
          created_at?: string
          destination: string
          end_date?: string | null
          expires_at?: string
          hit_count?: number
          interests?: string[]
          itinerary_data: Json
          pax_adults?: number
          pax_children?: number
          start_date?: string | null
        }
        Update: {
          brief_hash?: string
          budget_range?: string | null
          created_at?: string
          destination?: string
          end_date?: string | null
          expires_at?: string
          hit_count?: number
          interests?: string[]
          itinerary_data?: Json
          pax_adults?: number
          pax_children?: number
          start_date?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          id: string
          name: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          id: string
          name?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string | null
        }
        Relationships: []
      }
      public_profiles: {
        Row: {
          avatar_url: string | null
          id: string
          name: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          id: string
          name?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          id?: string
          name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      claim_generation_job: {
        Args: { _job_id: string }
        Returns: {
          attempts: number
          brief: Json
          brief_hash: string
          id: string
          itinerary_id: string
          user_id: string
        }[]
      }
      record_generation_attempt: { Args: { _user_id: string }; Returns: Json }
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
