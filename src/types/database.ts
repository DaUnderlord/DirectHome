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
      conversation_participants: {
        Row: {
          conversation_id: string
          id: string
          joined_at: string | null
          unread_count: number | null
          user_id: string
        }
        Insert: {
          conversation_id: string
          id?: string
          joined_at?: string | null
          unread_count?: number | null
          user_id: string
        }
        Update: {
          conversation_id?: string
          id?: string
          joined_at?: string | null
          unread_count?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversation_participants_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversation_participants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          created_at: string | null
          id: string
          property_id: string | null
          status: Database["public"]["Enums"]["conversation_status"] | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          property_id?: string | null
          status?: Database["public"]["Enums"]["conversation_status"] | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          property_id?: string | null
          status?: Database["public"]["Enums"]["conversation_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversations_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      favorites: {
        Row: {
          created_at: string | null
          id: string
          property_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          property_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          property_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favorites_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      maintenance_requests: {
        Row: {
          actual_cost: number | null
          assigned_phone: string | null
          assigned_to: string | null
          category: string
          completed_at: string | null
          created_at: string | null
          description: string
          estimated_cost: number | null
          id: string
          images: string[] | null
          owner_id: string
          priority: Database["public"]["Enums"]["maintenance_priority"] | null
          property_id: string
          resolution_notes: string | null
          status: Database["public"]["Enums"]["maintenance_status"] | null
          tenant_id: string
          title: string
          updated_at: string | null
        }
        Insert: {
          actual_cost?: number | null
          assigned_phone?: string | null
          assigned_to?: string | null
          category: string
          completed_at?: string | null
          created_at?: string | null
          description: string
          estimated_cost?: number | null
          id?: string
          images?: string[] | null
          owner_id: string
          priority?: Database["public"]["Enums"]["maintenance_priority"] | null
          property_id: string
          resolution_notes?: string | null
          status?: Database["public"]["Enums"]["maintenance_status"] | null
          tenant_id: string
          title: string
          updated_at?: string | null
        }
        Update: {
          actual_cost?: number | null
          assigned_phone?: string | null
          assigned_to?: string | null
          category?: string
          completed_at?: string | null
          created_at?: string | null
          description?: string
          estimated_cost?: number | null
          id?: string
          images?: string[] | null
          owner_id?: string
          priority?: Database["public"]["Enums"]["maintenance_priority"] | null
          property_id?: string
          resolution_notes?: string | null
          status?: Database["public"]["Enums"]["maintenance_status"] | null
          tenant_id?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_requests_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maintenance_requests_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maintenance_requests_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          attachments: Json | null
          content: string
          conversation_id: string
          created_at: string | null
          deleted_at: string | null
          id: string
          is_deleted: boolean | null
          sender_id: string
          type: Database["public"]["Enums"]["message_type"] | null
          updated_at: string | null
        }
        Insert: {
          attachments?: Json | null
          content: string
          conversation_id: string
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          is_deleted?: boolean | null
          sender_id: string
          type?: Database["public"]["Enums"]["message_type"] | null
          updated_at?: string | null
        }
        Update: {
          attachments?: Json | null
          content?: string
          conversation_id?: string
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          is_deleted?: boolean | null
          sender_id?: string
          type?: Database["public"]["Enums"]["message_type"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          data: Json | null
          id: string
          message: string
          read: boolean | null
          read_at: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          data?: Json | null
          id?: string
          message: string
          read?: boolean | null
          read_at?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          data?: Json | null
          id?: string
          message?: string
          read?: boolean | null
          read_at?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          application_id: string | null
          created_at: string | null
          currency: string | null
          due_date: string | null
          id: string
          notes: string | null
          payer_id: string
          payment_date: string | null
          payment_method: string | null
          period_end: string | null
          period_start: string | null
          property_id: string
          receipt_url: string | null
          recipient_id: string
          status: Database["public"]["Enums"]["payment_status"] | null
          transaction_reference: string | null
          type: Database["public"]["Enums"]["payment_type"]
          updated_at: string | null
        }
        Insert: {
          amount: number
          application_id?: string | null
          created_at?: string | null
          currency?: string | null
          due_date?: string | null
          id?: string
          notes?: string | null
          payer_id: string
          payment_date?: string | null
          payment_method?: string | null
          period_end?: string | null
          period_start?: string | null
          property_id: string
          receipt_url?: string | null
          recipient_id: string
          status?: Database["public"]["Enums"]["payment_status"] | null
          transaction_reference?: string | null
          type: Database["public"]["Enums"]["payment_type"]
          updated_at?: string | null
        }
        Update: {
          amount?: number
          application_id?: string | null
          created_at?: string | null
          currency?: string | null
          due_date?: string | null
          id?: string
          notes?: string | null
          payer_id?: string
          payment_date?: string | null
          payment_method?: string | null
          period_end?: string | null
          period_start?: string | null
          property_id?: string
          receipt_url?: string | null
          recipient_id?: string
          status?: Database["public"]["Enums"]["payment_status"] | null
          transaction_reference?: string | null
          type?: Database["public"]["Enums"]["payment_type"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_payer_id_fkey"
            columns: ["payer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          account_status: Database["public"]["Enums"]["account_status"] | null
          address: string | null
          avatar_url: string | null
          bio: string | null
          city: string | null
          company: string | null
          created_at: string | null
          date_of_birth: string | null
          email: string
          email_verified: boolean | null
          first_name: string
          gender: string | null
          id: string
          last_login: string | null
          last_name: string
          notification_preferences: Json | null
          occupation: string | null
          phone: string | null
          phone_verified: boolean | null
          previous_roles: Database["public"]["Enums"]["user_role"][] | null
          property_owner_info: Json | null
          role: Database["public"]["Enums"]["user_role"]
          social_links: Json | null
          state: string | null
          trust_score: number | null
          updated_at: string | null
          verification_status: Database["public"]["Enums"]["verification_status"] | null
          verified_documents: string[] | null
          website: string | null
          zip_code: string | null
        }
        Insert: {
          account_status?: Database["public"]["Enums"]["account_status"] | null
          address?: string | null
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          company?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email: string
          email_verified?: boolean | null
          first_name: string
          gender?: string | null
          id: string
          last_login?: string | null
          last_name: string
          notification_preferences?: Json | null
          occupation?: string | null
          phone?: string | null
          phone_verified?: boolean | null
          previous_roles?: Database["public"]["Enums"]["user_role"][] | null
          property_owner_info?: Json | null
          role?: Database["public"]["Enums"]["user_role"]
          social_links?: Json | null
          state?: string | null
          trust_score?: number | null
          updated_at?: string | null
          verification_status?: Database["public"]["Enums"]["verification_status"] | null
          verified_documents?: string[] | null
          website?: string | null
          zip_code?: string | null
        }
        Update: {
          account_status?: Database["public"]["Enums"]["account_status"] | null
          address?: string | null
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          company?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email?: string
          email_verified?: boolean | null
          first_name?: string
          gender?: string | null
          id?: string
          last_login?: string | null
          last_name?: string
          notification_preferences?: Json | null
          occupation?: string | null
          phone?: string | null
          phone_verified?: boolean | null
          previous_roles?: Database["public"]["Enums"]["user_role"][] | null
          property_owner_info?: Json | null
          role?: Database["public"]["Enums"]["user_role"]
          social_links?: Json | null
          state?: string | null
          trust_score?: number | null
          updated_at?: string | null
          verification_status?: Database["public"]["Enums"]["verification_status"] | null
          verified_documents?: string[] | null
          website?: string | null
          zip_code?: string | null
        }
        Relationships: []
      }
      properties: {
        Row: {
          access_route: string | null
          additional_fees: Json | null
          additional_rules: string[] | null
          address: string
          agency_fee: number | null
          amenities: string[] | null
          available_from: string | null
          bathrooms: number
          bedrooms: number
          building_condition: Database["public"]["Enums"]["building_condition"] | null
          category: Database["public"]["Enums"]["property_category"] | null
          caution_fee: number | null
          children_allowed: boolean | null
          city: string
          country: string | null
          created_at: string | null
          currency: string | null
          description: string
          favorite_count: number | null
          featured: boolean | null
          floors: number | null
          furnished: boolean | null
          furnishing_status: Database["public"]["Enums"]["furnishing_status"] | null
          id: string
          inquiry_count: number | null
          kitchen_type: string | null
          landmark: string | null
          latitude: number | null
          lease_terms: string[] | null
          legal_fee: number | null
          lga: string | null
          listing_type: Database["public"]["Enums"]["listing_type"]
          longitude: number | null
          lot_size: number | null
          maximum_stay: number | null
          minimum_stay: number | null
          negotiable: boolean | null
          neighborhood: string | null
          nepa_hours: number | null
          nigerian_property_type: Database["public"]["Enums"]["nigerian_property_type"] | null
          outdoor_features: string[] | null
          owner_id: string
          parking_spaces: number | null
          parties_allowed: boolean | null
          payment_cycle: Database["public"]["Enums"]["payment_cycle"] | null
          payment_frequency: string | null
          pets_allowed: boolean | null
          power_supply: string | null
          price: number
          property_type: Database["public"]["Enums"]["property_type"]
          published_at: string | null
          security_deposit: number | null
          security_features: string[] | null
          service_charge: number | null
          smoking_allowed: boolean | null
          square_footage: number | null
          state: string
          status: Database["public"]["Enums"]["property_status"]
          title: string
          toilets: number | null
          updated_at: string | null
          utilities: Json | null
          verification_status: Database["public"]["Enums"]["property_verification_status"] | null
          view_count: number | null
          water_source: string | null
          year_built: number | null
          zip_code: string | null
          accessibility_options: string[] | null
        }
        Insert: {
          access_route?: string | null
          additional_fees?: Json | null
          additional_rules?: string[] | null
          address: string
          agency_fee?: number | null
          amenities?: string[] | null
          available_from?: string | null
          bathrooms?: number
          bedrooms?: number
          building_condition?: Database["public"]["Enums"]["building_condition"] | null
          category?: Database["public"]["Enums"]["property_category"] | null
          caution_fee?: number | null
          children_allowed?: boolean | null
          city: string
          country?: string | null
          created_at?: string | null
          currency?: string | null
          description: string
          favorite_count?: number | null
          featured?: boolean | null
          floors?: number | null
          furnished?: boolean | null
          furnishing_status?: Database["public"]["Enums"]["furnishing_status"] | null
          id?: string
          inquiry_count?: number | null
          kitchen_type?: string | null
          landmark?: string | null
          latitude?: number | null
          lease_terms?: string[] | null
          legal_fee?: number | null
          lga?: string | null
          listing_type?: Database["public"]["Enums"]["listing_type"]
          longitude?: number | null
          lot_size?: number | null
          maximum_stay?: number | null
          minimum_stay?: number | null
          negotiable?: boolean | null
          neighborhood?: string | null
          nepa_hours?: number | null
          nigerian_property_type?: Database["public"]["Enums"]["nigerian_property_type"] | null
          outdoor_features?: string[] | null
          owner_id: string
          parking_spaces?: number | null
          parties_allowed?: boolean | null
          payment_cycle?: Database["public"]["Enums"]["payment_cycle"] | null
          payment_frequency?: string | null
          pets_allowed?: boolean | null
          power_supply?: string | null
          price: number
          property_type?: Database["public"]["Enums"]["property_type"]
          published_at?: string | null
          security_deposit?: number | null
          security_features?: string[] | null
          service_charge?: number | null
          smoking_allowed?: boolean | null
          square_footage?: number | null
          state: string
          status?: Database["public"]["Enums"]["property_status"]
          title: string
          toilets?: number | null
          updated_at?: string | null
          utilities?: Json | null
          verification_status?: Database["public"]["Enums"]["property_verification_status"] | null
          view_count?: number | null
          water_source?: string | null
          year_built?: number | null
          zip_code?: string | null
          accessibility_options?: string[] | null
        }
        Update: {
          access_route?: string | null
          additional_fees?: Json | null
          additional_rules?: string[] | null
          address?: string
          agency_fee?: number | null
          amenities?: string[] | null
          available_from?: string | null
          bathrooms?: number
          bedrooms?: number
          building_condition?: Database["public"]["Enums"]["building_condition"] | null
          category?: Database["public"]["Enums"]["property_category"] | null
          caution_fee?: number | null
          children_allowed?: boolean | null
          city?: string
          country?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string
          favorite_count?: number | null
          featured?: boolean | null
          floors?: number | null
          furnished?: boolean | null
          furnishing_status?: Database["public"]["Enums"]["furnishing_status"] | null
          id?: string
          inquiry_count?: number | null
          kitchen_type?: string | null
          landmark?: string | null
          latitude?: number | null
          lease_terms?: string[] | null
          legal_fee?: number | null
          lga?: string | null
          listing_type?: Database["public"]["Enums"]["listing_type"]
          longitude?: number | null
          lot_size?: number | null
          maximum_stay?: number | null
          minimum_stay?: number | null
          negotiable?: boolean | null
          neighborhood?: string | null
          nepa_hours?: number | null
          nigerian_property_type?: Database["public"]["Enums"]["nigerian_property_type"] | null
          outdoor_features?: string[] | null
          owner_id?: string
          parking_spaces?: number | null
          parties_allowed?: boolean | null
          payment_cycle?: Database["public"]["Enums"]["payment_cycle"] | null
          payment_frequency?: string | null
          pets_allowed?: boolean | null
          power_supply?: string | null
          price?: number
          property_type?: Database["public"]["Enums"]["property_type"]
          published_at?: string | null
          security_deposit?: number | null
          security_features?: string[] | null
          service_charge?: number | null
          smoking_allowed?: boolean | null
          square_footage?: number | null
          state?: string
          status?: Database["public"]["Enums"]["property_status"]
          title?: string
          toilets?: number | null
          updated_at?: string | null
          utilities?: Json | null
          verification_status?: Database["public"]["Enums"]["property_verification_status"] | null
          view_count?: number | null
          water_source?: string | null
          year_built?: number | null
          zip_code?: string | null
          accessibility_options?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "properties_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      property_enquiries: {
        Row: {
          created_at: string | null
          id: string
          message: string
          owner_id: string
          priority: string | null
          property_id: string
          seeker_id: string
          status: Database["public"]["Enums"]["enquiry_status"] | null
          subject: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          owner_id: string
          priority?: string | null
          property_id: string
          seeker_id: string
          status?: Database["public"]["Enums"]["enquiry_status"] | null
          subject: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          owner_id?: string
          priority?: string | null
          property_id?: string
          seeker_id?: string
          status?: Database["public"]["Enums"]["enquiry_status"] | null
          subject?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "property_enquiries_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "property_enquiries_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "property_enquiries_seeker_id_fkey"
            columns: ["seeker_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      property_images: {
        Row: {
          caption: string | null
          created_at: string | null
          display_order: number | null
          id: string
          is_primary: boolean | null
          property_id: string
          thumbnail_url: string | null
          type: string | null
          url: string
        }
        Insert: {
          caption?: string | null
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_primary?: boolean | null
          property_id: string
          thumbnail_url?: string | null
          type?: string | null
          url: string
        }
        Update: {
          caption?: string | null
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_primary?: boolean | null
          property_id?: string
          thumbnail_url?: string | null
          type?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "property_images_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      property_viewings: {
        Row: {
          created_at: string | null
          id: string
          notes: string | null
          owner_feedback: string | null
          owner_id: string
          property_id: string
          rating: number | null
          scheduled_date: string
          scheduled_time: string
          seeker_feedback: string | null
          seeker_id: string
          status: Database["public"]["Enums"]["viewing_status"] | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          notes?: string | null
          owner_feedback?: string | null
          owner_id: string
          property_id: string
          rating?: number | null
          scheduled_date: string
          scheduled_time: string
          seeker_feedback?: string | null
          seeker_id: string
          status?: Database["public"]["Enums"]["viewing_status"] | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          notes?: string | null
          owner_feedback?: string | null
          owner_id?: string
          property_id?: string
          rating?: number | null
          scheduled_date?: string
          scheduled_time?: string
          seeker_feedback?: string | null
          seeker_id?: string
          status?: Database["public"]["Enums"]["viewing_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "property_viewings_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "property_viewings_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "property_viewings_seeker_id_fkey"
            columns: ["seeker_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      property_views: {
        Row: {
          id: string
          ip_address: string | null
          property_id: string
          user_agent: string | null
          viewed_at: string | null
          viewer_id: string | null
        }
        Insert: {
          id?: string
          ip_address?: string | null
          property_id: string
          user_agent?: string | null
          viewed_at?: string | null
          viewer_id?: string | null
        }
        Update: {
          id?: string
          ip_address?: string | null
          property_id?: string
          user_agent?: string | null
          viewed_at?: string | null
          viewer_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "property_views_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "property_views_viewer_id_fkey"
            columns: ["viewer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_searches: {
        Row: {
          created_at: string | null
          filters: Json
          id: string
          name: string
          notifications_enabled: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          filters: Json
          id?: string
          name: string
          notifications_enabled?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          filters?: Json
          id?: string
          name?: string
          notifications_enabled?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_searches_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tenant_applications: {
        Row: {
          applicant_id: string
          created_at: string | null
          documents: Json | null
          employer_name: string | null
          employment_status: string | null
          has_pets: boolean | null
          id: string
          lease_duration: number | null
          monthly_income: number | null
          move_in_date: string | null
          occupants: number | null
          owner_id: string
          pet_details: string | null
          property_id: string
          review_notes: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: Database["public"]["Enums"]["application_status"] | null
          updated_at: string | null
        }
        Insert: {
          applicant_id: string
          created_at?: string | null
          documents?: Json | null
          employer_name?: string | null
          employment_status?: string | null
          has_pets?: boolean | null
          id?: string
          lease_duration?: number | null
          monthly_income?: number | null
          move_in_date?: string | null
          occupants?: number | null
          owner_id: string
          pet_details?: string | null
          property_id: string
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["application_status"] | null
          updated_at?: string | null
        }
        Update: {
          applicant_id?: string
          created_at?: string | null
          documents?: Json | null
          employer_name?: string | null
          employment_status?: string | null
          has_pets?: boolean | null
          id?: string
          lease_duration?: number | null
          monthly_income?: number | null
          move_in_date?: string | null
          occupants?: number | null
          owner_id?: string
          pet_details?: string | null
          property_id?: string
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["application_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tenant_applications_applicant_id_fkey"
            columns: ["applicant_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tenant_applications_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tenant_applications_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tenant_applications_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      account_status: "active" | "suspended" | "deactivated" | "deleted"
      application_status:
        | "pending"
        | "under_review"
        | "approved"
        | "rejected"
        | "withdrawn"
      building_condition:
        | "newly_built"
        | "renovated"
        | "good"
        | "fair"
        | "needs_renovation"
      conversation_status: "active" | "archived" | "blocked"
      enquiry_status: "new" | "responded" | "in_progress" | "closed" | "spam"
      furnishing_status: "furnished" | "semi_furnished" | "unfurnished"
      listing_type: "rent" | "sale"
      maintenance_priority: "low" | "medium" | "high" | "urgent"
      maintenance_status: "pending" | "in_progress" | "completed" | "cancelled"
      message_type: "text" | "image" | "document" | "appointment" | "system"
      nigerian_property_type:
        | "self_con"
        | "mini_flat"
        | "1_bedroom"
        | "2_bedroom"
        | "3_bedroom"
        | "4_bedroom"
        | "5_bedroom"
        | "duplex"
        | "penthouse"
        | "bungalow"
        | "terrace"
        | "detached"
        | "semi_detached"
        | "commercial"
        | "land"
      payment_cycle:
        | "daily"
        | "weekly"
        | "monthly"
        | "quarterly"
        | "biannually"
        | "yearly"
        | "per_night"
      payment_status:
        | "pending"
        | "completed"
        | "failed"
        | "refunded"
        | "cancelled"
      payment_type:
        | "rent"
        | "deposit"
        | "caution_fee"
        | "legal_fee"
        | "service_charge"
        | "other"
      property_category: "rent" | "sale" | "short_stay" | "lease"
      property_status:
        | "active"
        | "pending"
        | "rented"
        | "sold"
        | "inactive"
        | "draft"
      property_type:
        | "house"
        | "condo"
        | "townhouse"
        | "apartment"
        | "land"
        | "commercial"
        | "other"
      property_verification_status:
        | "unverified"
        | "pending"
        | "verified"
        | "rejected"
      user_role: "homeowner" | "homeseeker" | "admin"
      verification_status: "unverified" | "pending" | "verified" | "rejected"
      viewing_status:
        | "pending"
        | "confirmed"
        | "completed"
        | "cancelled"
        | "no_show"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
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
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
        Database["public"]["Views"])
    ? (Database["public"]["Tables"] &
        Database["public"]["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
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
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
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
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
    ? Database["public"]["Enums"][PublicEnumNameOrOptions]
    : never
