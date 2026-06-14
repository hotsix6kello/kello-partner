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
      beauty_booking_notifications: {
        Row: {
          booking_id: string
          channel: string
          created_at: string
          dispatch_status: string | null
          dispatched_at: string | null
          error_log: string | null
          event_type: string
          id: string
          last_resent_at: string | null
          message: string
          metadata_json: Json | null
          read_at: string | null
          resend_count: number | null
          resent_by: string | null
          status: string
          title: string
          user_id: string
        }
        Insert: {
          booking_id: string
          channel?: string
          created_at?: string
          dispatch_status?: string | null
          dispatched_at?: string | null
          error_log?: string | null
          event_type: string
          id?: string
          last_resent_at?: string | null
          message: string
          metadata_json?: Json | null
          read_at?: string | null
          resend_count?: number | null
          resent_by?: string | null
          status?: string
          title: string
          user_id: string
        }
        Update: {
          booking_id?: string
          channel?: string
          created_at?: string
          dispatch_status?: string | null
          dispatched_at?: string | null
          error_log?: string | null
          event_type?: string
          id?: string
          last_resent_at?: string | null
          message?: string
          metadata_json?: Json | null
          read_at?: string | null
          resend_count?: number | null
          resent_by?: string | null
          status?: string
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "beauty_booking_notifications_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "beauty_booking_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "beauty_booking_notifications_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "beauty_booking_requests_ko"
            referencedColumns: ["예약요청ID"]
          },
        ]
      }
      beauty_booking_request_images: {
        Row: {
          bucket_name: string
          created_at: string
          id: string
          image_type: string
          original_file_name: string | null
          request_id: string
          storage_path: string
          user_id: string
        }
        Insert: {
          bucket_name?: string
          created_at?: string
          id?: string
          image_type: string
          original_file_name?: string | null
          request_id: string
          storage_path: string
          user_id: string
        }
        Update: {
          bucket_name?: string
          created_at?: string
          id?: string
          image_type?: string
          original_file_name?: string | null
          request_id?: string
          storage_path?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "beauty_booking_request_images_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "beauty_booking_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "beauty_booking_request_images_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "beauty_booking_requests_ko"
            referencedColumns: ["예약요청ID"]
          },
        ]
      }
      beauty_booking_requests: {
        Row: {
          add_on_ids: string[]
          add_on_names: string[]
          add_on_price: number
          agreements: Json
          alternative_offer_items: Json | null
          alternative_offer_note: string | null
          alternative_offer_status: string | null
          alternative_offered_at: string | null
          alternative_offered_by: string | null
          alternative_response_at: string | null
          base_price: number
          beauty_category: string
          booking_date: string
          booking_time: string
          cancel_reason: string
          canceled_at: string | null
          canceled_by: string | null
          category: string
          change_reason: string
          change_request_status: string | null
          change_requested_at: string | null
          change_review_note: string
          change_reviewed_at: string | null
          change_reviewed_by: string | null
          communication_intent: string
          communication_language: string
          created_at: string
          created_from_flow: string
          current_image_url: string | null
          customer_contacted: boolean | null
          customer_email: string | null
          customer_name: string
          customer_phone: string
          customer_request: string
          customer_user_id: string | null
          designer_id: string | null
          designer_name: string | null
          designer_surcharge: number
          follow_up_needed: boolean | null
          id: string
          image_urls: string[] | null
          internal_note: string | null
          korean_message: string
          localized_message: string
          operator_status: string | null
          paid_at: string | null
          payload_json: Json
          payment_method: string | null
          payment_status: string | null
          payment_transaction_id: string | null
          paypal_capture_id: string | null
          paypal_order_id: string | null
          primary_service_id: string | null
          primary_service_name: string | null
          quote_currency: string | null
          quote_date: string | null
          quote_expires_at: string | null
          quote_note: string | null
          quote_refund_policy: string | null
          quote_responded_at: string | null
          quote_sent_at: string | null
          quote_service_name: string | null
          quote_shop_address: string | null
          quote_shop_name: string | null
          quote_status: string | null
          quote_time: string | null
          quote_total_price: number | null
          region: string
          shop_contacted: boolean | null
          status: string
          status_before_change_request: string | null
          store_id: string
          store_name: string
          style_image_url: string | null
          total_price: number
          updated_at: string
        }
        Insert: {
          add_on_ids?: string[]
          add_on_names?: string[]
          add_on_price?: number
          agreements?: Json
          alternative_offer_items?: Json | null
          alternative_offer_note?: string | null
          alternative_offer_status?: string | null
          alternative_offered_at?: string | null
          alternative_offered_by?: string | null
          alternative_response_at?: string | null
          base_price?: number
          beauty_category: string
          booking_date: string
          booking_time: string
          cancel_reason?: string
          canceled_at?: string | null
          canceled_by?: string | null
          category?: string
          change_reason?: string
          change_request_status?: string | null
          change_requested_at?: string | null
          change_review_note?: string
          change_reviewed_at?: string | null
          change_reviewed_by?: string | null
          communication_intent: string
          communication_language: string
          created_at?: string
          created_from_flow?: string
          current_image_url?: string | null
          customer_contacted?: boolean | null
          customer_email?: string | null
          customer_name: string
          customer_phone: string
          customer_request?: string
          customer_user_id?: string | null
          designer_id?: string | null
          designer_name?: string | null
          designer_surcharge?: number
          follow_up_needed?: boolean | null
          id?: string
          image_urls?: string[] | null
          internal_note?: string | null
          korean_message: string
          localized_message: string
          operator_status?: string | null
          paid_at?: string | null
          payload_json: Json
          payment_method?: string | null
          payment_status?: string | null
          payment_transaction_id?: string | null
          paypal_capture_id?: string | null
          paypal_order_id?: string | null
          primary_service_id?: string | null
          primary_service_name?: string | null
          quote_currency?: string | null
          quote_date?: string | null
          quote_expires_at?: string | null
          quote_note?: string | null
          quote_refund_policy?: string | null
          quote_responded_at?: string | null
          quote_sent_at?: string | null
          quote_service_name?: string | null
          quote_shop_address?: string | null
          quote_shop_name?: string | null
          quote_status?: string | null
          quote_time?: string | null
          quote_total_price?: number | null
          region: string
          shop_contacted?: boolean | null
          status?: string
          status_before_change_request?: string | null
          store_id: string
          store_name: string
          style_image_url?: string | null
          total_price?: number
          updated_at?: string
        }
        Update: {
          add_on_ids?: string[]
          add_on_names?: string[]
          add_on_price?: number
          agreements?: Json
          alternative_offer_items?: Json | null
          alternative_offer_note?: string | null
          alternative_offer_status?: string | null
          alternative_offered_at?: string | null
          alternative_offered_by?: string | null
          alternative_response_at?: string | null
          base_price?: number
          beauty_category?: string
          booking_date?: string
          booking_time?: string
          cancel_reason?: string
          canceled_at?: string | null
          canceled_by?: string | null
          category?: string
          change_reason?: string
          change_request_status?: string | null
          change_requested_at?: string | null
          change_review_note?: string
          change_reviewed_at?: string | null
          change_reviewed_by?: string | null
          communication_intent?: string
          communication_language?: string
          created_at?: string
          created_from_flow?: string
          current_image_url?: string | null
          customer_contacted?: boolean | null
          customer_email?: string | null
          customer_name?: string
          customer_phone?: string
          customer_request?: string
          customer_user_id?: string | null
          designer_id?: string | null
          designer_name?: string | null
          designer_surcharge?: number
          follow_up_needed?: boolean | null
          id?: string
          image_urls?: string[] | null
          internal_note?: string | null
          korean_message?: string
          localized_message?: string
          operator_status?: string | null
          paid_at?: string | null
          payload_json?: Json
          payment_method?: string | null
          payment_status?: string | null
          payment_transaction_id?: string | null
          paypal_capture_id?: string | null
          paypal_order_id?: string | null
          primary_service_id?: string | null
          primary_service_name?: string | null
          quote_currency?: string | null
          quote_date?: string | null
          quote_expires_at?: string | null
          quote_note?: string | null
          quote_refund_policy?: string | null
          quote_responded_at?: string | null
          quote_sent_at?: string | null
          quote_service_name?: string | null
          quote_shop_address?: string | null
          quote_shop_name?: string | null
          quote_status?: string | null
          quote_time?: string | null
          quote_total_price?: number | null
          region?: string
          shop_contacted?: boolean | null
          status?: string
          status_before_change_request?: string | null
          store_id?: string
          store_name?: string
          style_image_url?: string | null
          total_price?: number
          updated_at?: string
        }
        Relationships: []
      }
      beauty_notification_preferences: {
        Row: {
          alternative_offer_updates_enabled: boolean
          booking_updates_enabled: boolean
          change_request_updates_enabled: boolean
          email_enabled: boolean
          in_app_enabled: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          alternative_offer_updates_enabled?: boolean
          booking_updates_enabled?: boolean
          change_request_updates_enabled?: boolean
          email_enabled?: boolean
          in_app_enabled?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          alternative_offer_updates_enabled?: boolean
          booking_updates_enabled?: boolean
          change_request_updates_enabled?: boolean
          email_enabled?: boolean
          in_app_enabled?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      booking_concierge_events: {
        Row: {
          booking_id: string | null
          created_at: string
          customer_locale: string
          id: string
          normalized_text: string
          original_text: string
          response_ko: string
          response_localized: string
          session_id: string
          structured_output: Json
          tools: Json
        }
        Insert: {
          booking_id?: string | null
          created_at?: string
          customer_locale: string
          id?: string
          normalized_text: string
          original_text: string
          response_ko: string
          response_localized: string
          session_id: string
          structured_output: Json
          tools?: Json
        }
        Update: {
          booking_id?: string | null
          created_at?: string
          customer_locale?: string
          id?: string
          normalized_text?: string
          original_text?: string
          response_ko?: string
          response_localized?: string
          session_id?: string
          structured_output?: Json
          tools?: Json
        }
        Relationships: []
      }
      booking_records: {
        Row: {
          booking_date: string
          booking_time: string
          created_at: string
          id: string
          notes: string | null
          service_name: string
          session_id: string
          status: string
          updated_at: string
        }
        Insert: {
          booking_date: string
          booking_time: string
          created_at?: string
          id: string
          notes?: string | null
          service_name: string
          session_id: string
          status: string
          updated_at?: string
        }
        Update: {
          booking_date?: string
          booking_time?: string
          created_at?: string
          id?: string
          notes?: string | null
          service_name?: string
          session_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      business_hours: {
        Row: {
          break_end_time: string | null
          break_start_time: string | null
          created_at: string
          day_of_week: number
          end_time: string | null
          id: string
          is_open: boolean
          start_time: string | null
          store_id: string
          updated_at: string
        }
        Insert: {
          break_end_time?: string | null
          break_start_time?: string | null
          created_at?: string
          day_of_week: number
          end_time?: string | null
          id?: string
          is_open?: boolean
          start_time?: string | null
          store_id: string
          updated_at?: string
        }
        Update: {
          break_end_time?: string | null
          break_start_time?: string | null
          created_at?: string
          day_of_week?: number
          end_time?: string | null
          id?: string
          is_open?: boolean
          start_time?: string | null
          store_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_hours_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string
          id: string
          name: string
          order_index: number
          store_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          order_index?: number
          store_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          order_index?: number
          store_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      closed_dates: {
        Row: {
          closed_date: string
          created_at: string
          id: string
          reason: string | null
          store_id: string
        }
        Insert: {
          closed_date: string
          created_at?: string
          id?: string
          reason?: string | null
          store_id: string
        }
        Update: {
          closed_date?: string
          created_at?: string
          id?: string
          reason?: string | null
          store_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "closed_dates_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      community_comments: {
        Row: {
          author: string
          author_user_id: string | null
          content: string
          created_at: string
          id: number
          post_id: number
        }
        Insert: {
          author: string
          author_user_id?: string | null
          content: string
          created_at?: string
          id?: never
          post_id: number
        }
        Update: {
          author?: string
          author_user_id?: string | null
          content?: string
          created_at?: string
          id?: never
          post_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "community_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts_ko"
            referencedColumns: ["게시글ID"]
          },
        ]
      }
      community_posts: {
        Row: {
          author: string
          author_user_id: string | null
          comments: number
          created_at: string
          desc: string
          dislikes_count: number
          flag: string
          id: number
          likes_count: number
          time: string
          title: string
          type: string
        }
        Insert: {
          author: string
          author_user_id?: string | null
          comments?: number
          created_at?: string
          desc: string
          dislikes_count?: number
          flag: string
          id?: number
          likes_count?: number
          time: string
          title: string
          type: string
        }
        Update: {
          author?: string
          author_user_id?: string | null
          comments?: number
          created_at?: string
          desc?: string
          dislikes_count?: number
          flag?: string
          id?: number
          likes_count?: number
          time?: string
          title?: string
          type?: string
        }
        Relationships: []
      }
      community_reactions: {
        Row: {
          created_at: string
          id: string
          post_id: number
          reaction_type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: number
          reaction_type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: number
          reaction_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_reactions_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_reactions_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts_ko"
            referencedColumns: ["게시글ID"]
          },
        ]
      }
      coupons: {
        Row: {
          created_at: string
          discount_type: string
          discount_value: number
          id: string
          is_used: boolean
          issue_reason: string
          user_id: string
        }
        Insert: {
          created_at?: string
          discount_type: string
          discount_value?: number
          id?: string
          is_used?: boolean
          issue_reason: string
          user_id: string
        }
        Update: {
          created_at?: string
          discount_type?: string
          discount_value?: number
          id?: string
          is_used?: boolean
          issue_reason?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "coupons_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coupons_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles_ko"
            referencedColumns: ["사용자ID"]
          },
        ]
      }
      interpreter_sessions: {
        Row: {
          created_at: string
          customer_locale: string
          ephemeral_token: string
          expires_at: string
          id: string
          staff_locale: string
        }
        Insert: {
          created_at?: string
          customer_locale: string
          ephemeral_token: string
          expires_at: string
          id?: string
          staff_locale: string
        }
        Update: {
          created_at?: string
          customer_locale?: string
          ephemeral_token?: string
          expires_at?: string
          id?: string
          staff_locale?: string
        }
        Relationships: []
      }
      interpreter_turns: {
        Row: {
          created_at: string
          id: string
          input_mode: string
          original_text: string
          session_id: string
          source_locale: string
          speaker: string
          target_locale: string
          translated_text: string
        }
        Insert: {
          created_at?: string
          id?: string
          input_mode: string
          original_text: string
          session_id: string
          source_locale: string
          speaker: string
          target_locale: string
          translated_text: string
        }
        Update: {
          created_at?: string
          id?: string
          input_mode?: string
          original_text?: string
          session_id?: string
          source_locale?: string
          speaker?: string
          target_locale?: string
          translated_text?: string
        }
        Relationships: [
          {
            foreignKeyName: "interpreter_turns_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "interpreter_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interpreter_turns_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "interpreter_sessions_ko"
            referencedColumns: ["세션ID"]
          },
        ]
      }
      menu_item_options: {
        Row: {
          created_at: string
          id: string
          menu_item_id: string
          name: string
          order_index: number
          price: number
        }
        Insert: {
          created_at?: string
          id?: string
          menu_item_id: string
          name: string
          order_index?: number
          price: number
        }
        Update: {
          created_at?: string
          id?: string
          menu_item_id?: string
          name?: string
          order_index?: number
          price?: number
        }
        Relationships: [
          {
            foreignKeyName: "menu_item_options_menu_item_id_fkey"
            columns: ["menu_item_id"]
            isOneToOne: false
            referencedRelation: "menu_items"
            referencedColumns: ["id"]
          },
        ]
      }
      menu_items: {
        Row: {
          category_id: string
          created_at: string
          description: string | null
          duration_min: number
          id: string
          name: string
          order_index: number
          price: number | null
          price_max: number | null
          price_min: number | null
          price_type: Database["public"]["Enums"]["price_type"]
          review_reason: string | null
          review_status: Database["public"]["Enums"]["review_status"]
          store_id: string
          updated_at: string
          visible: boolean
        }
        Insert: {
          category_id: string
          created_at?: string
          description?: string | null
          duration_min: number
          id?: string
          name: string
          order_index?: number
          price?: number | null
          price_max?: number | null
          price_min?: number | null
          price_type?: Database["public"]["Enums"]["price_type"]
          review_reason?: string | null
          review_status?: Database["public"]["Enums"]["review_status"]
          store_id: string
          updated_at?: string
          visible?: boolean
        }
        Update: {
          category_id?: string
          created_at?: string
          description?: string | null
          duration_min?: number
          id?: string
          name?: string
          order_index?: number
          price?: number | null
          price_max?: number | null
          price_min?: number | null
          price_type?: Database["public"]["Enums"]["price_type"]
          review_reason?: string | null
          review_status?: Database["public"]["Enums"]["review_status"]
          store_id?: string
          updated_at?: string
          visible?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "menu_items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "menu_items_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      partners: {
        Row: {
          address: string | null
          business_type: string
          company_name: string
          contact_name: string
          created_at: string
          description: string | null
          email: string
          id: number
          phone: string
          reject_reason: string | null
          reviewed_at: string | null
          status: string
          visibility_status: boolean
          website: string | null
        }
        Insert: {
          address?: string | null
          business_type: string
          company_name: string
          contact_name: string
          created_at?: string
          description?: string | null
          email: string
          id?: number
          phone: string
          reject_reason?: string | null
          reviewed_at?: string | null
          status?: string
          visibility_status?: boolean
          website?: string | null
        }
        Update: {
          address?: string | null
          business_type?: string
          company_name?: string
          contact_name?: string
          created_at?: string
          description?: string | null
          email?: string
          id?: number
          phone?: string
          reject_reason?: string | null
          reviewed_at?: string | null
          status?: string
          visibility_status?: boolean
          website?: string | null
        }
        Relationships: []
      }
      photos: {
        Row: {
          category_id: string | null
          created_at: string
          crop: Json | null
          id: string
          order_index: number
          review_reason: string | null
          review_status: Database["public"]["Enums"]["review_status"]
          slot_index: number
          slot_type: Database["public"]["Enums"]["photo_slot_type"]
          storage_path: string | null
          store_id: string
          updated_at: string
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          crop?: Json | null
          id?: string
          order_index?: number
          review_reason?: string | null
          review_status?: Database["public"]["Enums"]["review_status"]
          slot_index?: number
          slot_type: Database["public"]["Enums"]["photo_slot_type"]
          storage_path?: string | null
          store_id: string
          updated_at?: string
        }
        Update: {
          category_id?: string | null
          created_at?: string
          crop?: Json | null
          id?: string
          order_index?: number
          review_reason?: string | null
          review_status?: Database["public"]["Enums"]["review_status"]
          slot_index?: number
          slot_type?: Database["public"]["Enums"]["photo_slot_type"]
          storage_path?: string | null
          store_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "photos_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "photos_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_path: string | null
          avatar_url: string | null
          country: string
          created_at: string
          display_name: string | null
          id: string
          is_admin: boolean
          nickname: string | null
          nickname_updated_at: string | null
          phone: string | null
          referral_code: string | null
          role: Database["public"]["Enums"]["app_role"] | null
          sns: string | null
        }
        Insert: {
          avatar_path?: string | null
          avatar_url?: string | null
          country?: string
          created_at?: string
          display_name?: string | null
          id: string
          is_admin?: boolean
          nickname?: string | null
          nickname_updated_at?: string | null
          phone?: string | null
          referral_code?: string | null
          role?: Database["public"]["Enums"]["app_role"] | null
          sns?: string | null
        }
        Update: {
          avatar_path?: string | null
          avatar_url?: string | null
          country?: string
          created_at?: string
          display_name?: string | null
          id?: string
          is_admin?: boolean
          nickname?: string | null
          nickname_updated_at?: string | null
          phone?: string | null
          referral_code?: string | null
          role?: Database["public"]["Enums"]["app_role"] | null
          sns?: string | null
        }
        Relationships: []
      }
      referrals: {
        Row: {
          created_at: string
          id: string
          referred_id: string
          referrer_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          referred_id: string
          referrer_id: string
        }
        Update: {
          created_at?: string
          id?: string
          referred_id?: string
          referrer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "referrals_referred_id_fkey"
            columns: ["referred_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referrals_referred_id_fkey"
            columns: ["referred_id"]
            isOneToOne: true
            referencedRelation: "profiles_ko"
            referencedColumns: ["사용자ID"]
          },
          {
            foreignKeyName: "referrals_referrer_id_fkey"
            columns: ["referrer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referrals_referrer_id_fkey"
            columns: ["referrer_id"]
            isOneToOne: false
            referencedRelation: "profiles_ko"
            referencedColumns: ["사용자ID"]
          },
        ]
      }
      stores: {
        Row: {
          address: string
          business_types: Database["public"]["Enums"]["business_type"][]
          capacity: number
          created_at: string
          description: string
          id: string
          lead_time_hours: number
          name: string
          owner_id: string
          phone: string
          slot_interval_minutes: number
          updated_at: string
        }
        Insert: {
          address?: string
          business_types?: Database["public"]["Enums"]["business_type"][]
          capacity?: number
          created_at?: string
          description?: string
          id?: string
          lead_time_hours?: number
          name?: string
          owner_id: string
          phone?: string
          slot_interval_minutes?: number
          updated_at?: string
        }
        Update: {
          address?: string
          business_types?: Database["public"]["Enums"]["business_type"][]
          capacity?: number
          created_at?: string
          description?: string
          id?: string
          lead_time_hours?: number
          name?: string
          owner_id?: string
          phone?: string
          slot_interval_minutes?: number
          updated_at?: string
        }
        Relationships: []
      }
      translation_batch_jobs: {
        Row: {
          completed_at: string | null
          content_type: string
          created_at: string
          domain: string
          failed_count: number
          id: string
          processed_count: number
          queued_count: number
          requested_locales: string[]
          started_at: string | null
          status: string
          summary: Json
          translated_count: number
        }
        Insert: {
          completed_at?: string | null
          content_type?: string
          created_at?: string
          domain: string
          failed_count?: number
          id?: string
          processed_count?: number
          queued_count?: number
          requested_locales?: string[]
          started_at?: string | null
          status?: string
          summary?: Json
          translated_count?: number
        }
        Update: {
          completed_at?: string | null
          content_type?: string
          created_at?: string
          domain?: string
          failed_count?: number
          id?: string
          processed_count?: number
          queued_count?: number
          requested_locales?: string[]
          started_at?: string | null
          status?: string
          summary?: Json
          translated_count?: number
        }
        Relationships: []
      }
      translation_contents: {
        Row: {
          content_type: string
          created_at: string
          domain: string
          error_message: string | null
          id: string
          metadata: Json
          mode: string
          schema_version: string
          source_fields: Json
          source_hash: string
          source_id: string
          source_locale: string
          source_payload: Json | null
          source_table: string
          source_version: number
          status: string
          target_locales: string[]
          updated_at: string
        }
        Insert: {
          content_type: string
          created_at?: string
          domain: string
          error_message?: string | null
          id?: string
          metadata?: Json
          mode: string
          schema_version?: string
          source_fields?: Json
          source_hash: string
          source_id?: string
          source_locale?: string
          source_payload?: Json | null
          source_table?: string
          source_version?: number
          status?: string
          target_locales?: string[]
          updated_at?: string
        }
        Update: {
          content_type?: string
          created_at?: string
          domain?: string
          error_message?: string | null
          id?: string
          metadata?: Json
          mode?: string
          schema_version?: string
          source_fields?: Json
          source_hash?: string
          source_id?: string
          source_locale?: string
          source_payload?: Json | null
          source_table?: string
          source_version?: number
          status?: string
          target_locales?: string[]
          updated_at?: string
        }
        Relationships: []
      }
      translation_glossary: {
        Row: {
          created_at: string
          domain: string
          id: string
          is_active: boolean
          notes: string | null
          priority: number
          source_locale: string
          source_term: string
          target_locale: string
          target_term: string
          updated_at: string
          updated_by: string | null
          version: number
        }
        Insert: {
          created_at?: string
          domain: string
          id?: string
          is_active?: boolean
          notes?: string | null
          priority?: number
          source_locale?: string
          source_term: string
          target_locale: string
          target_term: string
          updated_at?: string
          updated_by?: string | null
          version?: number
        }
        Update: {
          created_at?: string
          domain?: string
          id?: string
          is_active?: boolean
          notes?: string | null
          priority?: number
          source_locale?: string
          source_term?: string
          target_locale?: string
          target_term?: string
          updated_at?: string
          updated_by?: string | null
          version?: number
        }
        Relationships: []
      }
      translation_versions: {
        Row: {
          cache_key: string
          content_id: string
          created_at: string
          error_message: string | null
          fallback_used: boolean
          glossary_version: number
          id: string
          metadata: Json
          source_hash: string
          status: string
          target_locale: string
          translated_fields: Json
          translated_payload: Json | null
          translated_text: string | null
          translation_engine: string
          version: number
        }
        Insert: {
          cache_key: string
          content_id: string
          created_at?: string
          error_message?: string | null
          fallback_used?: boolean
          glossary_version?: number
          id?: string
          metadata?: Json
          source_hash: string
          status?: string
          target_locale: string
          translated_fields?: Json
          translated_payload?: Json | null
          translated_text?: string | null
          translation_engine: string
          version?: number
        }
        Update: {
          cache_key?: string
          content_id?: string
          created_at?: string
          error_message?: string | null
          fallback_used?: boolean
          glossary_version?: number
          id?: string
          metadata?: Json
          source_hash?: string
          status?: string
          target_locale?: string
          translated_fields?: Json
          translated_payload?: Json | null
          translated_text?: string | null
          translation_engine?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "translation_versions_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "translation_contents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "translation_versions_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "translation_contents_ko"
            referencedColumns: ["번역콘텐츠ID"]
          },
        ]
      }
      visitor_logs: {
        Row: {
          created_at: string
          id: string
          visit_date: string
          visitor_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          visit_date?: string
          visitor_id: string
        }
        Update: {
          created_at?: string
          id?: string
          visit_date?: string
          visitor_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      beauty_booking_notifications_ko: {
        Row: {
          메시지: string | null
          메타데이터JSON: Json | null
          발송상태: string | null
          발송일시: string | null
          사용자ID: string | null
          상태: string | null
          생성일시: string | null
          알림ID: string | null
          예약요청ID: string | null
          오류로그: string | null
          이벤트유형: string | null
          읽음일시: string | null
          재발송자ID: string | null
          재발송횟수: number | null
          제목: string | null
          채널: string | null
          최근재발송일시: string | null
        }
        Insert: {
          메시지?: string | null
          메타데이터JSON?: Json | null
          발송상태?: string | null
          발송일시?: string | null
          사용자ID?: string | null
          상태?: string | null
          생성일시?: string | null
          알림ID?: string | null
          예약요청ID?: string | null
          오류로그?: string | null
          이벤트유형?: string | null
          읽음일시?: string | null
          재발송자ID?: string | null
          재발송횟수?: number | null
          제목?: string | null
          채널?: string | null
          최근재발송일시?: string | null
        }
        Update: {
          메시지?: string | null
          메타데이터JSON?: Json | null
          발송상태?: string | null
          발송일시?: string | null
          사용자ID?: string | null
          상태?: string | null
          생성일시?: string | null
          알림ID?: string | null
          예약요청ID?: string | null
          오류로그?: string | null
          이벤트유형?: string | null
          읽음일시?: string | null
          재발송자ID?: string | null
          재발송횟수?: number | null
          제목?: string | null
          채널?: string | null
          최근재발송일시?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "beauty_booking_notifications_booking_id_fkey"
            columns: ["예약요청ID"]
            isOneToOne: false
            referencedRelation: "beauty_booking_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "beauty_booking_notifications_booking_id_fkey"
            columns: ["예약요청ID"]
            isOneToOne: false
            referencedRelation: "beauty_booking_requests_ko"
            referencedColumns: ["예약요청ID"]
          },
        ]
      }
      beauty_booking_request_images_ko: {
        Row: {
          버킷명: string | null
          사용자ID: string | null
          생성일시: string | null
          예약요청ID: string | null
          원본파일명: string | null
          이미지ID: string | null
          이미지유형: string | null
          저장경로: string | null
        }
        Insert: {
          버킷명?: string | null
          사용자ID?: string | null
          생성일시?: string | null
          예약요청ID?: string | null
          원본파일명?: string | null
          이미지ID?: string | null
          이미지유형?: string | null
          저장경로?: string | null
        }
        Update: {
          버킷명?: string | null
          사용자ID?: string | null
          생성일시?: string | null
          예약요청ID?: string | null
          원본파일명?: string | null
          이미지ID?: string | null
          이미지유형?: string | null
          저장경로?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "beauty_booking_request_images_request_id_fkey"
            columns: ["예약요청ID"]
            isOneToOne: false
            referencedRelation: "beauty_booking_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "beauty_booking_request_images_request_id_fkey"
            columns: ["예약요청ID"]
            isOneToOne: false
            referencedRelation: "beauty_booking_requests_ko"
            referencedColumns: ["예약요청ID"]
          },
        ]
      }
      beauty_booking_requests_ko: {
        Row: {
          고객명: string | null
          고객사용자ID: string | null
          고객연락여부: boolean | null
          고객요청사항: string | null
          고객이메일: string | null
          고객전화번호: string | null
          기본금액: number | null
          내부메모: string | null
          대체응답일시: string | null
          대체제안메모: string | null
          대체제안상태: string | null
          대체제안일시: string | null
          대체제안자ID: string | null
          대체제안항목JSON: Json | null
          대표시술ID: string | null
          대표시술명: string | null
          동의내역JSON: Json | null
          디자이너ID: string | null
          디자이너명: string | null
          디자이너추가금액: number | null
          매장ID: string | null
          매장명: string | null
          매장연락여부: boolean | null
          변경검토메모: string | null
          변경검토일시: string | null
          변경검토자ID: string | null
          변경요청사유: string | null
          변경요청상태: string | null
          변경요청일시: string | null
          변경요청전상태: string | null
          뷰티카테고리: string | null
          생성일시: string | null
          생성플로우: string | null
          소통언어: string | null
          소통의도: string | null
          수정일시: string | null
          스타일이미지URL: string | null
          예약상태: string | null
          예약시간: string | null
          예약요청ID: string | null
          예약일: string | null
          운영상태: string | null
          원본페이로드JSON: Json | null
          이미지URL목록: string[] | null
          지역: string | null
          총금액: number | null
          추가옵션ID목록: string[] | null
          추가옵션금액: number | null
          추가옵션명목록: string[] | null
          취소사유: string | null
          취소일시: string | null
          취소주체: string | null
          카테고리: string | null
          한국어메시지: string | null
          현재이미지URL: string | null
          현지어메시지: string | null
          후속확인필요여부: boolean | null
        }
        Insert: {
          고객명?: string | null
          고객사용자ID?: string | null
          고객연락여부?: boolean | null
          고객요청사항?: string | null
          고객이메일?: string | null
          고객전화번호?: string | null
          기본금액?: number | null
          내부메모?: string | null
          대체응답일시?: string | null
          대체제안메모?: string | null
          대체제안상태?: string | null
          대체제안일시?: string | null
          대체제안자ID?: string | null
          대체제안항목JSON?: Json | null
          대표시술ID?: string | null
          대표시술명?: string | null
          동의내역JSON?: Json | null
          디자이너ID?: string | null
          디자이너명?: string | null
          디자이너추가금액?: number | null
          매장ID?: string | null
          매장명?: string | null
          매장연락여부?: boolean | null
          변경검토메모?: string | null
          변경검토일시?: string | null
          변경검토자ID?: string | null
          변경요청사유?: string | null
          변경요청상태?: string | null
          변경요청일시?: string | null
          변경요청전상태?: string | null
          뷰티카테고리?: string | null
          생성일시?: string | null
          생성플로우?: string | null
          소통언어?: string | null
          소통의도?: string | null
          수정일시?: string | null
          스타일이미지URL?: string | null
          예약상태?: string | null
          예약시간?: string | null
          예약요청ID?: string | null
          예약일?: string | null
          운영상태?: string | null
          원본페이로드JSON?: Json | null
          이미지URL목록?: string[] | null
          지역?: string | null
          총금액?: number | null
          추가옵션ID목록?: string[] | null
          추가옵션금액?: number | null
          추가옵션명목록?: string[] | null
          취소사유?: string | null
          취소일시?: string | null
          취소주체?: string | null
          카테고리?: string | null
          한국어메시지?: string | null
          현재이미지URL?: string | null
          현지어메시지?: string | null
          후속확인필요여부?: boolean | null
        }
        Update: {
          고객명?: string | null
          고객사용자ID?: string | null
          고객연락여부?: boolean | null
          고객요청사항?: string | null
          고객이메일?: string | null
          고객전화번호?: string | null
          기본금액?: number | null
          내부메모?: string | null
          대체응답일시?: string | null
          대체제안메모?: string | null
          대체제안상태?: string | null
          대체제안일시?: string | null
          대체제안자ID?: string | null
          대체제안항목JSON?: Json | null
          대표시술ID?: string | null
          대표시술명?: string | null
          동의내역JSON?: Json | null
          디자이너ID?: string | null
          디자이너명?: string | null
          디자이너추가금액?: number | null
          매장ID?: string | null
          매장명?: string | null
          매장연락여부?: boolean | null
          변경검토메모?: string | null
          변경검토일시?: string | null
          변경검토자ID?: string | null
          변경요청사유?: string | null
          변경요청상태?: string | null
          변경요청일시?: string | null
          변경요청전상태?: string | null
          뷰티카테고리?: string | null
          생성일시?: string | null
          생성플로우?: string | null
          소통언어?: string | null
          소통의도?: string | null
          수정일시?: string | null
          스타일이미지URL?: string | null
          예약상태?: string | null
          예약시간?: string | null
          예약요청ID?: string | null
          예약일?: string | null
          운영상태?: string | null
          원본페이로드JSON?: Json | null
          이미지URL목록?: string[] | null
          지역?: string | null
          총금액?: number | null
          추가옵션ID목록?: string[] | null
          추가옵션금액?: number | null
          추가옵션명목록?: string[] | null
          취소사유?: string | null
          취소일시?: string | null
          취소주체?: string | null
          카테고리?: string | null
          한국어메시지?: string | null
          현재이미지URL?: string | null
          현지어메시지?: string | null
          후속확인필요여부?: boolean | null
        }
        Relationships: []
      }
      beauty_notification_preferences_ko: {
        Row: {
          대체제안알림허용: boolean | null
          변경요청알림허용: boolean | null
          사용자ID: string | null
          수정일시: string | null
          예약업데이트알림허용: boolean | null
          이메일알림허용: boolean | null
          인앱알림허용: boolean | null
        }
        Insert: {
          대체제안알림허용?: boolean | null
          변경요청알림허용?: boolean | null
          사용자ID?: string | null
          수정일시?: string | null
          예약업데이트알림허용?: boolean | null
          이메일알림허용?: boolean | null
          인앱알림허용?: boolean | null
        }
        Update: {
          대체제안알림허용?: boolean | null
          변경요청알림허용?: boolean | null
          사용자ID?: string | null
          수정일시?: string | null
          예약업데이트알림허용?: boolean | null
          이메일알림허용?: boolean | null
          인앱알림허용?: boolean | null
        }
        Relationships: []
      }
      booking_concierge_events_ko: {
        Row: {
          고객로케일: string | null
          구조화출력JSON: Json | null
          도구기록JSON: Json | null
          생성일시: string | null
          세션ID: string | null
          예약기록ID: string | null
          원문텍스트: string | null
          이벤트ID: string | null
          정규화텍스트: string | null
          한국어응답: string | null
          현지어응답: string | null
        }
        Insert: {
          고객로케일?: string | null
          구조화출력JSON?: Json | null
          도구기록JSON?: Json | null
          생성일시?: string | null
          세션ID?: string | null
          예약기록ID?: string | null
          원문텍스트?: string | null
          이벤트ID?: string | null
          정규화텍스트?: string | null
          한국어응답?: string | null
          현지어응답?: string | null
        }
        Update: {
          고객로케일?: string | null
          구조화출력JSON?: Json | null
          도구기록JSON?: Json | null
          생성일시?: string | null
          세션ID?: string | null
          예약기록ID?: string | null
          원문텍스트?: string | null
          이벤트ID?: string | null
          정규화텍스트?: string | null
          한국어응답?: string | null
          현지어응답?: string | null
        }
        Relationships: []
      }
      booking_records_ko: {
        Row: {
          메모: string | null
          상태: string | null
          생성일시: string | null
          서비스명: string | null
          세션ID: string | null
          수정일시: string | null
          예약기록ID: string | null
          예약시간: string | null
          예약일: string | null
        }
        Insert: {
          메모?: string | null
          상태?: string | null
          생성일시?: string | null
          서비스명?: string | null
          세션ID?: string | null
          수정일시?: string | null
          예약기록ID?: string | null
          예약시간?: string | null
          예약일?: string | null
        }
        Update: {
          메모?: string | null
          상태?: string | null
          생성일시?: string | null
          서비스명?: string | null
          세션ID?: string | null
          수정일시?: string | null
          예약기록ID?: string | null
          예약시간?: string | null
          예약일?: string | null
        }
        Relationships: []
      }
      community_comments_ko: {
        Row: {
          게시글ID: number | null
          내용: string | null
          댓글ID: number | null
          생성일시: string | null
          작성자: string | null
          작성자사용자ID: string | null
        }
        Insert: {
          게시글ID?: number | null
          내용?: string | null
          댓글ID?: number | null
          생성일시?: string | null
          작성자?: string | null
          작성자사용자ID?: string | null
        }
        Update: {
          게시글ID?: number | null
          내용?: string | null
          댓글ID?: number | null
          생성일시?: string | null
          작성자?: string | null
          작성자사용자ID?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "community_comments_post_id_fkey"
            columns: ["게시글ID"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_comments_post_id_fkey"
            columns: ["게시글ID"]
            isOneToOne: false
            referencedRelation: "community_posts_ko"
            referencedColumns: ["게시글ID"]
          },
        ]
      }
      community_posts_ko: {
        Row: {
          게시글ID: number | null
          댓글수: number | null
          말머리: string | null
          생성일시: string | null
          설명: string | null
          시간표시: string | null
          싫어요수: number | null
          유형: string | null
          작성자: string | null
          제목: string | null
          좋아요수: number | null
        }
        Insert: {
          게시글ID?: number | null
          댓글수?: number | null
          말머리?: string | null
          생성일시?: string | null
          설명?: string | null
          시간표시?: string | null
          싫어요수?: number | null
          유형?: string | null
          작성자?: string | null
          제목?: string | null
          좋아요수?: number | null
        }
        Update: {
          게시글ID?: number | null
          댓글수?: number | null
          말머리?: string | null
          생성일시?: string | null
          설명?: string | null
          시간표시?: string | null
          싫어요수?: number | null
          유형?: string | null
          작성자?: string | null
          제목?: string | null
          좋아요수?: number | null
        }
        Relationships: []
      }
      community_reactions_ko: {
        Row: {
          게시글ID: number | null
          반응ID: string | null
          반응유형: string | null
          사용자ID: string | null
          생성일시: string | null
        }
        Insert: {
          게시글ID?: number | null
          반응ID?: string | null
          반응유형?: string | null
          사용자ID?: string | null
          생성일시?: string | null
        }
        Update: {
          게시글ID?: number | null
          반응ID?: string | null
          반응유형?: string | null
          사용자ID?: string | null
          생성일시?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "community_reactions_post_id_fkey"
            columns: ["게시글ID"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_reactions_post_id_fkey"
            columns: ["게시글ID"]
            isOneToOne: false
            referencedRelation: "community_posts_ko"
            referencedColumns: ["게시글ID"]
          },
        ]
      }
      coupons_ko: {
        Row: {
          발급사유: string | null
          사용여부: boolean | null
          사용자ID: string | null
          생성일시: string | null
          쿠폰ID: string | null
          할인값: number | null
          할인유형: string | null
        }
        Insert: {
          발급사유?: string | null
          사용여부?: boolean | null
          사용자ID?: string | null
          생성일시?: string | null
          쿠폰ID?: string | null
          할인값?: number | null
          할인유형?: string | null
        }
        Update: {
          발급사유?: string | null
          사용여부?: boolean | null
          사용자ID?: string | null
          생성일시?: string | null
          쿠폰ID?: string | null
          할인값?: number | null
          할인유형?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "coupons_user_id_fkey"
            columns: ["사용자ID"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coupons_user_id_fkey"
            columns: ["사용자ID"]
            isOneToOne: false
            referencedRelation: "profiles_ko"
            referencedColumns: ["사용자ID"]
          },
        ]
      }
      interpreter_sessions_ko: {
        Row: {
          고객로케일: string | null
          만료일시: string | null
          생성일시: string | null
          세션ID: string | null
          임시토큰: string | null
          직원로케일: string | null
        }
        Insert: {
          고객로케일?: string | null
          만료일시?: string | null
          생성일시?: string | null
          세션ID?: string | null
          임시토큰?: string | null
          직원로케일?: string | null
        }
        Update: {
          고객로케일?: string | null
          만료일시?: string | null
          생성일시?: string | null
          세션ID?: string | null
          임시토큰?: string | null
          직원로케일?: string | null
        }
        Relationships: []
      }
      interpreter_turns_ko: {
        Row: {
          대상로케일: string | null
          번역텍스트: string | null
          생성일시: string | null
          세션ID: string | null
          원문로케일: string | null
          원문텍스트: string | null
          입력방식: string | null
          턴ID: string | null
          화자: string | null
        }
        Insert: {
          대상로케일?: string | null
          번역텍스트?: string | null
          생성일시?: string | null
          세션ID?: string | null
          원문로케일?: string | null
          원문텍스트?: string | null
          입력방식?: string | null
          턴ID?: string | null
          화자?: string | null
        }
        Update: {
          대상로케일?: string | null
          번역텍스트?: string | null
          생성일시?: string | null
          세션ID?: string | null
          원문로케일?: string | null
          원문텍스트?: string | null
          입력방식?: string | null
          턴ID?: string | null
          화자?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "interpreter_turns_session_id_fkey"
            columns: ["세션ID"]
            isOneToOne: false
            referencedRelation: "interpreter_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interpreter_turns_session_id_fkey"
            columns: ["세션ID"]
            isOneToOne: false
            referencedRelation: "interpreter_sessions_ko"
            referencedColumns: ["세션ID"]
          },
        ]
      }
      partners_ko: {
        Row: {
          거절사유: string | null
          검토일시: string | null
          노출상태: boolean | null
          담당자명: string | null
          상태: string | null
          생성일시: string | null
          설명: string | null
          업종: string | null
          업체명: string | null
          웹사이트: string | null
          이메일: string | null
          전화번호: string | null
          주소: string | null
          파트너ID: number | null
        }
        Insert: {
          거절사유?: string | null
          검토일시?: string | null
          노출상태?: boolean | null
          담당자명?: string | null
          상태?: string | null
          생성일시?: string | null
          설명?: string | null
          업종?: string | null
          업체명?: string | null
          웹사이트?: string | null
          이메일?: string | null
          전화번호?: string | null
          주소?: string | null
          파트너ID?: number | null
        }
        Update: {
          거절사유?: string | null
          검토일시?: string | null
          노출상태?: boolean | null
          담당자명?: string | null
          상태?: string | null
          생성일시?: string | null
          설명?: string | null
          업종?: string | null
          업체명?: string | null
          웹사이트?: string | null
          이메일?: string | null
          전화번호?: string | null
          주소?: string | null
          파트너ID?: number | null
        }
        Relationships: []
      }
      profiles_ko: {
        Row: {
          SNS: string | null
          관리자여부: boolean | null
          국가코드: string | null
          권한역할: Database["public"]["Enums"]["app_role"] | null
          닉네임: string | null
          사용자ID: string | null
          생성일시: string | null
          아바타URL: string | null
          아바타경로: string | null
          전화번호: string | null
          추천코드: string | null
          표시이름: string | null
        }
        Insert: {
          SNS?: string | null
          관리자여부?: boolean | null
          국가코드?: string | null
          권한역할?: Database["public"]["Enums"]["app_role"] | null
          닉네임?: string | null
          사용자ID?: string | null
          생성일시?: string | null
          아바타URL?: string | null
          아바타경로?: string | null
          전화번호?: string | null
          추천코드?: string | null
          표시이름?: string | null
        }
        Update: {
          SNS?: string | null
          관리자여부?: boolean | null
          국가코드?: string | null
          권한역할?: Database["public"]["Enums"]["app_role"] | null
          닉네임?: string | null
          사용자ID?: string | null
          생성일시?: string | null
          아바타URL?: string | null
          아바타경로?: string | null
          전화번호?: string | null
          추천코드?: string | null
          표시이름?: string | null
        }
        Relationships: []
      }
      referrals_ko: {
        Row: {
          생성일시: string | null
          추천관계ID: string | null
          추천인ID: string | null
          피추천인ID: string | null
        }
        Insert: {
          생성일시?: string | null
          추천관계ID?: string | null
          추천인ID?: string | null
          피추천인ID?: string | null
        }
        Update: {
          생성일시?: string | null
          추천관계ID?: string | null
          추천인ID?: string | null
          피추천인ID?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "referrals_referred_id_fkey"
            columns: ["피추천인ID"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referrals_referred_id_fkey"
            columns: ["피추천인ID"]
            isOneToOne: true
            referencedRelation: "profiles_ko"
            referencedColumns: ["사용자ID"]
          },
          {
            foreignKeyName: "referrals_referrer_id_fkey"
            columns: ["추천인ID"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referrals_referrer_id_fkey"
            columns: ["추천인ID"]
            isOneToOne: false
            referencedRelation: "profiles_ko"
            referencedColumns: ["사용자ID"]
          },
        ]
      }
      translation_batch_jobs_ko: {
        Row: {
          대기건수: number | null
          도메인: string | null
          배치작업ID: string | null
          번역완료건수: number | null
          상태: string | null
          생성일시: string | null
          시작일시: string | null
          실패건수: number | null
          완료일시: string | null
          요약JSON: Json | null
          요청로케일목록: string[] | null
          처리건수: number | null
          콘텐츠유형: string | null
        }
        Insert: {
          대기건수?: number | null
          도메인?: string | null
          배치작업ID?: string | null
          번역완료건수?: number | null
          상태?: string | null
          생성일시?: string | null
          시작일시?: string | null
          실패건수?: number | null
          완료일시?: string | null
          요약JSON?: Json | null
          요청로케일목록?: string[] | null
          처리건수?: number | null
          콘텐츠유형?: string | null
        }
        Update: {
          대기건수?: number | null
          도메인?: string | null
          배치작업ID?: string | null
          번역완료건수?: number | null
          상태?: string | null
          생성일시?: string | null
          시작일시?: string | null
          실패건수?: number | null
          완료일시?: string | null
          요약JSON?: Json | null
          요청로케일목록?: string[] | null
          처리건수?: number | null
          콘텐츠유형?: string | null
        }
        Relationships: []
      }
      translation_contents_ko: {
        Row: {
          대상로케일목록: string[] | null
          도메인: string | null
          메타데이터JSON: Json | null
          모드: string | null
          번역콘텐츠ID: string | null
          상태: string | null
          생성일시: string | null
          수정일시: string | null
          스키마버전: string | null
          오류메시지: string | null
          원본ID: string | null
          원본로케일: string | null
          원본버전: number | null
          원본테이블명: string | null
          원본페이로드JSON: Json | null
          원본필드JSON: Json | null
          원본해시: string | null
          콘텐츠유형: string | null
        }
        Insert: {
          대상로케일목록?: string[] | null
          도메인?: string | null
          메타데이터JSON?: Json | null
          모드?: string | null
          번역콘텐츠ID?: string | null
          상태?: string | null
          생성일시?: string | null
          수정일시?: string | null
          스키마버전?: string | null
          오류메시지?: string | null
          원본ID?: string | null
          원본로케일?: string | null
          원본버전?: number | null
          원본테이블명?: string | null
          원본페이로드JSON?: Json | null
          원본필드JSON?: Json | null
          원본해시?: string | null
          콘텐츠유형?: string | null
        }
        Update: {
          대상로케일목록?: string[] | null
          도메인?: string | null
          메타데이터JSON?: Json | null
          모드?: string | null
          번역콘텐츠ID?: string | null
          상태?: string | null
          생성일시?: string | null
          수정일시?: string | null
          스키마버전?: string | null
          오류메시지?: string | null
          원본ID?: string | null
          원본로케일?: string | null
          원본버전?: number | null
          원본테이블명?: string | null
          원본페이로드JSON?: Json | null
          원본필드JSON?: Json | null
          원본해시?: string | null
          콘텐츠유형?: string | null
        }
        Relationships: []
      }
      translation_glossary_ko: {
        Row: {
          대상로케일: string | null
          대상용어: string | null
          도메인: string | null
          메모: string | null
          버전: number | null
          생성일시: string | null
          수정일시: string | null
          수정자: string | null
          용어집ID: string | null
          우선순위: number | null
          원본로케일: string | null
          원본용어: string | null
          활성여부: boolean | null
        }
        Insert: {
          대상로케일?: string | null
          대상용어?: string | null
          도메인?: string | null
          메모?: string | null
          버전?: number | null
          생성일시?: string | null
          수정일시?: string | null
          수정자?: string | null
          용어집ID?: string | null
          우선순위?: number | null
          원본로케일?: string | null
          원본용어?: string | null
          활성여부?: boolean | null
        }
        Update: {
          대상로케일?: string | null
          대상용어?: string | null
          도메인?: string | null
          메모?: string | null
          버전?: number | null
          생성일시?: string | null
          수정일시?: string | null
          수정자?: string | null
          용어집ID?: string | null
          우선순위?: number | null
          원본로케일?: string | null
          원본용어?: string | null
          활성여부?: boolean | null
        }
        Relationships: []
      }
      translation_versions_ko: {
        Row: {
          대상로케일: string | null
          메타데이터JSON: Json | null
          버전: number | null
          번역버전ID: string | null
          번역엔진: string | null
          번역텍스트: string | null
          번역페이로드JSON: Json | null
          번역필드JSON: Json | null
          상태: string | null
          생성일시: string | null
          오류메시지: string | null
          용어집버전: number | null
          원본해시: string | null
          캐시키: string | null
          콘텐츠ID: string | null
          폴백사용여부: boolean | null
        }
        Insert: {
          대상로케일?: string | null
          메타데이터JSON?: Json | null
          버전?: number | null
          번역버전ID?: string | null
          번역엔진?: string | null
          번역텍스트?: string | null
          번역페이로드JSON?: Json | null
          번역필드JSON?: Json | null
          상태?: string | null
          생성일시?: string | null
          오류메시지?: string | null
          용어집버전?: number | null
          원본해시?: string | null
          캐시키?: string | null
          콘텐츠ID?: string | null
          폴백사용여부?: boolean | null
        }
        Update: {
          대상로케일?: string | null
          메타데이터JSON?: Json | null
          버전?: number | null
          번역버전ID?: string | null
          번역엔진?: string | null
          번역텍스트?: string | null
          번역페이로드JSON?: Json | null
          번역필드JSON?: Json | null
          상태?: string | null
          생성일시?: string | null
          오류메시지?: string | null
          용어집버전?: number | null
          원본해시?: string | null
          캐시키?: string | null
          콘텐츠ID?: string | null
          폴백사용여부?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "translation_versions_content_id_fkey"
            columns: ["콘텐츠ID"]
            isOneToOne: false
            referencedRelation: "translation_contents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "translation_versions_content_id_fkey"
            columns: ["콘텐츠ID"]
            isOneToOne: false
            referencedRelation: "translation_contents_ko"
            referencedColumns: ["번역콘텐츠ID"]
          },
        ]
      }
      visitor_logs_ko: {
        Row: {
          방문로그ID: string | null
          방문일: string | null
          방문자ID: string | null
          생성일시: string | null
        }
        Insert: {
          방문로그ID?: string | null
          방문일?: string | null
          방문자ID?: string | null
          생성일시?: string | null
        }
        Update: {
          방문로그ID?: string | null
          방문일?: string | null
          방문자ID?: string | null
          생성일시?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      apply_referral_code: {
        Args: { p_referred_id: string; p_referrer_code: string }
        Returns: Json
      }
      generate_referral_code: { Args: never; Returns: string }
      get_visitor_counts: {
        Args: never
        Returns: {
          today_count: number
          total_count: number
        }[]
      }
      issue_signup_coupon: { Args: { p_user_id: string }; Returns: Json }
    }
    Enums: {
      app_role: "admin" | "super_admin"
      business_type:
        | "hair"
        | "nail"
        | "eyelash"
        | "makeup"
        | "esthetic"
        | "waxing"
      photo_slot_type: "representative" | "interior" | "treatment"
      price_type: "fixed" | "from" | "range"
      review_status: "pending" | "approved" | "rejected"
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
      app_role: ["admin", "super_admin"],
      business_type: [
        "hair",
        "nail",
        "eyelash",
        "makeup",
        "esthetic",
        "waxing",
      ],
      photo_slot_type: ["representative", "interior", "treatment"],
      price_type: ["fixed", "from", "range"],
      review_status: ["pending", "approved", "rejected"],
    },
  },
} as const
