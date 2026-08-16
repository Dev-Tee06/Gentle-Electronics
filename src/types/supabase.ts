export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          role: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          role?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          role?: string
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          image_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          price: number
          category_id: string | null
          image_url: string | null
          is_available: boolean
          is_featured: boolean
          sku: string | null
          stock_quantity: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          price: number
          category_id?: string | null
          image_url?: string | null
          is_available?: boolean
          is_featured?: boolean
          sku?: string | null
          stock_quantity?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          price?: number
          category_id?: string | null
          image_url?: string | null
          is_available?: boolean
          is_featured?: boolean
          sku?: string | null
          stock_quantity?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      product_images: {
        Row: {
          id: string
          product_id: string
          image_url: string
          alt_text: string | null
          display_order: number
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          image_url: string
          alt_text?: string | null
          display_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          image_url?: string
          alt_text?: string | null
          display_order?: number
          created_at?: string
        }
      }
      sales: {
        Row: {
          id: string
          reference: string
          sale_date: string
          total_amount: number
          customer_name: string | null
          customer_phone: string | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          reference: string
          sale_date?: string
          total_amount: number
          customer_name?: string | null
          customer_phone?: string | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          reference?: string
          sale_date?: string
          total_amount?: number
          customer_name?: string | null
          customer_phone?: string | null
          notes?: string | null
          created_at?: string
        }
      }
      sale_items: {
        Row: {
          id: string
          sale_id: string
          product_id: string | null
          product_name: string
          quantity: number
          unit_price: number
          subtotal: number
        }
        Insert: {
          id?: string
          sale_id: string
          product_id?: string | null
          product_name: string
          quantity: number
          unit_price: number
          subtotal: number
        }
        Update: {
          id?: string
          sale_id?: string
          product_id?: string | null
          product_name?: string
          quantity?: number
          unit_price?: number
          subtotal?: number
        }
      }
      checkout_events: {
        Row: {
          id: string
          event_type: string
          order_reference: string
          total_amount: number
          product_count: number
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          event_type: string
          order_reference: string
          total_amount: number
          product_count: number
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          event_type?: string
          order_reference?: string
          total_amount?: number
          product_count?: number
          metadata?: Json | null
          created_at?: string
        }
      }
    }
  }
}
