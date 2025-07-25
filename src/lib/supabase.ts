import { createClient } from '@supabase/supabase-js'
import { NutritionInfo, Location } from '@/types/admin'
import { createClientComponentClient, createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

// Configuration Supabase pour Terrano-Express
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Client pour les composants client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Client pour les composants client avec auth
export const createSupabaseClient = () => createClientComponentClient()

// Client pour les composants serveur
export const createSupabaseServerClient = () =>
  createServerComponentClient({ cookies })

// Types TypeScript pour la base de données
export interface Database {
  public: {
    Tables: {
      // Table des utilisateurs étendus
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          phone: string | null
          address: string | null
          city: string | null
          country: string | null
          loyalty_points: number
          loyalty_tier: 'bronze' | 'silver' | 'gold'
          total_spent: number
          orders_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          phone?: string | null
          address?: string | null
          city?: string | null
          country?: string | null
          loyalty_points?: number
          loyalty_tier?: 'bronze' | 'silver' | 'gold'
          total_spent?: number
          orders_count?: number
        }
        Update: {
          email?: string
          full_name?: string | null
          phone?: string | null
          address?: string | null
          city?: string | null
          country?: string | null
          loyalty_points?: number
          loyalty_tier?: 'bronze' | 'silver' | 'gold'
          total_spent?: number
          orders_count?: number
          updated_at?: string
        }
      }

      // Table des commandes
      orders: {
        Row: {
          id: string
          user_id: string | null
          customer_name: string
          customer_email: string
          customer_phone: string
          delivery_address: string
          total_amount: number
          tax_amount: number
          delivery_fee: number
          currency: string
          payment_method: 'card' | 'mobile_money' | 'cash_on_delivery'
          payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
          order_status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'cancelled'
          stripe_payment_intent_id: string | null
          estimated_delivery_time: string | null
          actual_delivery_time: string | null
          delivery_notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          customer_name: string
          customer_email: string
          customer_phone: string
          delivery_address: string
          total_amount: number
          tax_amount: number
          delivery_fee: number
          currency?: string
          payment_method: 'card' | 'mobile_money' | 'cash_on_delivery'
          payment_status?: 'pending' | 'paid' | 'failed' | 'refunded'
          order_status?: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'cancelled'
          stripe_payment_intent_id?: string | null
          estimated_delivery_time?: string | null
          delivery_notes?: string | null
        }
        Update: {
          payment_status?: 'pending' | 'paid' | 'failed' | 'refunded'
          order_status?: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'cancelled'
          estimated_delivery_time?: string | null
          actual_delivery_time?: string | null
          delivery_notes?: string | null
          updated_at?: string
        }
      }

      // Table des articles de commande
      order_items: {
        Row: {
          id: string
          order_id: string
          menu_item_id: string
          menu_item_name: string
          menu_item_price: number
          quantity: number
          special_requests: string | null
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          menu_item_id: string
          menu_item_name: string
          menu_item_price: number
          quantity: number
          special_requests?: string | null
        }
        Update: {
          quantity?: number
          special_requests?: string | null
        }
      }

      // Table des réservations
      reservations: {
        Row: {
          id: string
          user_id: string | null
          customer_name: string
          customer_email: string
          customer_phone: string
          reservation_date: string
          reservation_time: string
          party_size: number
          special_requests: string | null
          status: 'pending' | 'confirmed' | 'seated' | 'completed' | 'cancelled' | 'no_show'
          table_number: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          customer_name: string
          customer_email: string
          customer_phone: string
          reservation_date: string
          reservation_time: string
          party_size: number
          special_requests?: string | null
          status?: 'pending' | 'confirmed' | 'seated' | 'completed' | 'cancelled' | 'no_show'
          table_number?: string | null
        }
        Update: {
          reservation_date?: string
          reservation_time?: string
          party_size?: number
          special_requests?: string | null
          status?: 'pending' | 'confirmed' | 'seated' | 'completed' | 'cancelled' | 'no_show'
          table_number?: string | null
          updated_at?: string
        }
      }

      // Table des articles du menu
      menu_items: {
        Row: {
          id: string
          name: string
          description: string
          price: number
          currency: string
          category: string
          image_url: string | null
          is_available: boolean
          is_popular: boolean
          is_vegetarian: boolean
          is_vegan: boolean
          is_gluten_free: boolean
          preparation_time: number | null
          nutrition_info: NutritionInfo | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          price: number
          currency?: string
          category: string
          image_url?: string | null
          is_available?: boolean
          is_popular?: boolean
          is_vegetarian?: boolean
          is_vegan?: boolean
          is_gluten_free?: boolean
          preparation_time?: number | null
          nutrition_info?: NutritionInfo | null
        }
        Update: {
          name?: string
          description?: string
          price?: number
          category?: string
          image_url?: string | null
          is_available?: boolean
          is_popular?: boolean
          is_vegetarian?: boolean
          is_vegan?: boolean
          is_gluten_free?: boolean
          preparation_time?: number | null
          nutrition_info?: NutritionInfo | null
          updated_at?: string
        }
      }

      // Table de tracking des livraisons
      delivery_tracking: {
        Row: {
          id: string
          order_id: string
          driver_id: string | null
          driver_name: string | null
          driver_phone: string | null
          current_location: Location | null // JSON avec lat/lng
          status: 'assigned' | 'picked_up' | 'in_transit' | 'arrived' | 'delivered'
          estimated_arrival: string | null
          delivery_notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_id: string
          driver_id?: string | null
          driver_name?: string | null
          driver_phone?: string | null
          current_location?: Location | null
          status?: 'assigned' | 'picked_up' | 'in_transit' | 'arrived' | 'delivered'
          estimated_arrival?: string | null
          delivery_notes?: string | null
        }
        Update: {
          driver_id?: string | null
          driver_name?: string | null
          driver_phone?: string | null
          current_location?: Location | null
          status?: 'assigned' | 'picked_up' | 'in_transit' | 'arrived' | 'delivered'
          estimated_arrival?: string | null
          delivery_notes?: string | null
          updated_at?: string
        }
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
  }
}

// Fonctions utilitaires pour les opérations courantes
export class TerranoDB {
  private client: ReturnType<typeof createClient<Database>>

  constructor(client?: ReturnType<typeof createClient<Database>>) {
    this.client = client || (supabase as ReturnType<typeof createClient<Database>>)
  }

  // Opérations sur les commandes
  async createOrder(orderData: Database['public']['Tables']['orders']['Insert']) {
    const { data, error } = await this.client
      .from('orders')
      .insert(orderData)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async updateOrderStatus(
    orderId: string,
    status: Database['public']['Tables']['orders']['Row']['order_status']
  ) {
    const { data, error } = await this.client
      .from('orders')
      .update({
        order_status: status,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async getOrdersByUser(userId: string) {
    const { data, error } = await this.client
      .from('orders')
      .select(`
        *,
        order_items (*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }

  // Opérations sur les réservations
  async createReservation(reservationData: Database['public']['Tables']['reservations']['Insert']) {
    const { data, error } = await this.client
      .from('reservations')
      .insert(reservationData)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async getReservationsByDate(date: string) {
    const { data, error } = await this.client
      .from('reservations')
      .select('*')
      .eq('reservation_date', date)
      .order('reservation_time')

    if (error) throw error
    return data
  }

  // Opérations sur le menu
  async getMenuItems(category?: string) {
    let query = this.client
      .from('menu_items')
      .select('*')
      .eq('is_available', true)

    if (category && category !== 'all') {
      query = query.eq('category', category)
    }

    const { data, error } = await query.order('name')

    if (error) throw error
    return data
  }

  // Opérations sur le profil utilisateur
  async updateUserLoyaltyPoints(userId: string, pointsToAdd: number) {
    const { data: profile } = await this.client
      .from('profiles')
      .select('loyalty_points, total_spent, orders_count')
      .eq('id', userId)
      .single()

    if (!profile) throw new Error('Profil utilisateur non trouvé')

    const newPoints = profile.loyalty_points + pointsToAdd
    let newTier: Database['public']['Tables']['profiles']['Row']['loyalty_tier'] = 'bronze'

    if (newPoints >= 10000) newTier = 'gold'
    else if (newPoints >= 5000) newTier = 'silver'

    const { data, error } = await this.client
      .from('profiles')
      .update({
        loyalty_points: newPoints,
        loyalty_tier: newTier,
        orders_count: profile.orders_count + 1,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Tracking des livraisons
  async updateDeliveryLocation(orderId: string, location: { lat: number, lng: number }) {
    const { data, error } = await this.client
      .from('delivery_tracking')
      .update({
        current_location: location,
        updated_at: new Date().toISOString()
      })
      .eq('order_id', orderId)
      .select()
      .single()

    if (error) throw error
    return data
  }
}

// Instance globale
export const terranoDb = new TerranoDB()

export default supabase
