import { createClient } from '@supabase/supabase-js'
import { Order, Delivery, OrderItem, Customer, Driver } from '@/types/admin'

// Configuration Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types pour les tables Supabase
export interface DatabaseOrder {
  id: string
  customer_name: string
  customer_email: string
  customer_phone: string
  items: {
    name: string;
    quantity: number;
    price: number;
  }[]
  total: number
  status: string
  payment_status: string
  order_date: string
  order_time: string
  delivery_address: string
  delivery_time: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface DatabaseDelivery {
  id: string
  order_id: string
  customer_name: string
  customer_phone: string
  delivery_address: string
  delivery_coordinates?: { lat: number; lng: number }
  delivery_time: string
  estimated_delivery: string
  actual_delivery?: string
  status: string
  driver_id?: string
  driver_name?: string
  driver_phone?: string
  delivery_zone: string
  notes?: string
  created_at: string
  updated_at: string
}

// Service de base de données
export class DatabaseService {
  // === COMMANDES ===

  async getOrders(limit?: number): Promise<Order[]> {
    try {
      let query = supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })

      if (limit) {
        query = query.limit(limit)
      }

      const { data, error } = await query

      if (error) {
        console.error('Error fetching orders:', error)
        return this.getMockOrders() // Fallback vers données mockées
      }

      return data?.map(this.transformDatabaseOrderToOrder) || []
    } catch (error) {
      console.error('Database connection error:', error)
      return this.getMockOrders() // Fallback vers données mockées
    }
  }

  async createOrder(orderData: Omit<Order, 'id'>): Promise<Order | null> {
    try {
      const dbOrder: Omit<DatabaseOrder, 'id' | 'created_at' | 'updated_at'> = {
        customer_name: orderData.customer,
        customer_email: orderData.email || '',
        customer_phone: orderData.phone,
        items: orderData.items,
        total: orderData.total,
        status: orderData.status,
        payment_status: orderData.paymentStatus || 'pending',
        order_date: orderData.orderDate || new Date().toISOString().split('T')[0],
        order_time: orderData.orderTime || new Date().toTimeString().split(' ')[0],
        delivery_address: orderData.deliveryAddress || '',
        delivery_time: orderData.deliveryTime || '',
        notes: orderData.notes || '',
      }

      const { data, error } = await supabase
        .from('orders')
        .insert([dbOrder])
        .select()
        .single()

      if (error) {
        console.error('Error creating order:', error)
        return null
      }

      return this.transformDatabaseOrderToOrder(data)
    } catch (error) {
      console.error('Database connection error:', error)
      return null
    }
  }

  async updateOrderStatus(orderId: string, status: Order['status']): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('orders')
        .update({
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId)

      if (error) {
        console.error('Error updating order status:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Database connection error:', error)
      return false
    }
  }

  // === LIVRAISONS ===

  async getDeliveries(limit?: number): Promise<Delivery[]> {
    try {
      let query = supabase
        .from('deliveries')
        .select('*')
        .order('created_at', { ascending: false })

      if (limit) {
        query = query.limit(limit)
      }

      const { data, error } = await query

      if (error) {
        console.error('Error fetching deliveries:', error)
        return this.getMockDeliveries() // Fallback vers données mockées
      }

      return data?.map(this.transformDatabaseDeliveryToDelivery.bind(this)) || []
    } catch (error) {
      console.error('Database connection error:', error)
      return this.getMockDeliveries() // Fallback vers données mockées
    }
  }

  async createDelivery(deliveryData: Omit<Delivery, 'id'>): Promise<Delivery | null> {
    try {
      const dbDelivery: Omit<DatabaseDelivery, 'id' | 'created_at' | 'updated_at'> = {
        order_id: deliveryData.orderId,
        customer_name: deliveryData.customer || '',
        customer_phone: deliveryData.phone || '',
        delivery_address: deliveryData.address || '',
        delivery_coordinates: deliveryData.coordinates,
        delivery_time: deliveryData.deliveryTime || '',
        estimated_delivery: deliveryData.estimatedDelivery,
        actual_delivery: deliveryData.actualDelivery || '',
        status: deliveryData.status,
        driver_id: deliveryData.driverId,
        driver_name: deliveryData.driverName || '',
        driver_phone: deliveryData.driverPhone || '',
        delivery_zone: deliveryData.deliveryZone || '',
        notes: deliveryData.notes || '',
      }

      const { data, error } = await supabase
        .from('deliveries')
        .insert([dbDelivery])
        .select()
        .single()

      if (error) {
        console.error('Error creating delivery:', error)
        return null
      }

      return this.transformDatabaseDeliveryToDelivery(data)
    } catch (error) {
      console.error('Database connection error:', error)
      return null
    }
  }

  async updateDeliveryStatus(deliveryId: string, status: Delivery['status']): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('deliveries')
        .update({
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', deliveryId)

      if (error) {
        console.error('Error updating delivery status:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Database connection error:', error)
      return false
    }
  }

  // === STATISTIQUES ===

  async getStats() {
    try {
      const [ordersResult, deliveriesResult, driversResult] = await Promise.all([
        supabase.from('orders').select('status, total'),
        supabase.from('deliveries').select('status'),
        supabase.from('drivers').select('status')
      ])

      const orders = ordersResult.data || []
      const deliveries = deliveriesResult.data || []
      const drivers = driversResult.data || []

      return {
        totalOrders: orders.length,
        pendingOrders: orders.filter(o => ['preparing', 'preparing', 'in_transit'].includes(o.status)).length,
        activeDeliveries: deliveries.filter(d => ['in_transit', 'assigned'].includes(d.status)).length,
        availableDrivers: drivers.filter(d => d.status === 'disponible').length,
        totalRevenue: orders.filter(o => o.status === 'delivered').reduce((sum, o) => sum + o.total, 0),
        averageDeliveryTime: 25, // À calculer depuis les données réelles
        trends: {
          orders: 15, // Simulation de tendance
          revenue: 8,
          deliveries: 12
        }
      }
    } catch (error) {
      console.error('Error getting stats:', error)
      // Retourner des stats mockées
      return {
        totalOrders: 147,
        pendingOrders: 12,
        todayReservations: 8,
        totalRevenue: 3240.50,
        trends: { orders: 15, revenue: 8, reservations: -3 }
      }
    }
  }

  // === LIVREURS ===

  async getDrivers(): Promise<Driver[]> {
    try {
      const { data, error } = await supabase
        .from('drivers')
        .select('*')
        .order('name')

      if (error) {
        console.error('Error fetching drivers:', error)
        return this.getMockDrivers()
      }

      return data || []
    } catch (error) {
      console.error('Database connection error:', error)
      return this.getMockDrivers()
    }
  }

  async updateDriverStatus(driverId: string, status: Driver['status']): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('drivers')
        .update({ status })
        .eq('id', driverId)

      return !error
    } catch (error) {
      console.error('Database connection error:', error)
      return false
    }
  }

  // === TRANSFORMATEURS ===

  private transformDatabaseOrderToOrder(dbOrder: DatabaseOrder): Order {
    return {
      id: dbOrder.id,
      customer: dbOrder.customer_name,
      email: dbOrder.customer_email,
      phone: dbOrder.customer_phone,
      items: dbOrder.items,
      total: dbOrder.total,
      status: dbOrder.status as Order['status'],
      paymentStatus: dbOrder.payment_status as Order['paymentStatus'],
      orderDate: dbOrder.order_date,
      orderTime: dbOrder.order_time,
      deliveryAddress: dbOrder.delivery_address,
      deliveryTime: dbOrder.delivery_time,
      notes: dbOrder.notes,
    }
  }

  private transformDatabaseDeliveryToDelivery(dbDelivery: DatabaseDelivery): Delivery {
    return {
      id: dbDelivery.id,
      orderId: dbDelivery.order_id,
      customer: dbDelivery.customer_name,
      phone: dbDelivery.customer_phone,
      address: dbDelivery.delivery_address,
      coordinates: dbDelivery.delivery_coordinates,
      deliveryTime: dbDelivery.delivery_time,
      estimatedDelivery: dbDelivery.estimated_delivery,
      actualDelivery: dbDelivery.actual_delivery,
      status: dbDelivery.status as Delivery['status'],
      driverId: dbDelivery.driver_id || '',
      driverName: dbDelivery.driver_name,
      driverPhone: dbDelivery.driver_phone,
      deliveryZone: dbDelivery.delivery_zone || '',
      notes: dbDelivery.notes,
      createdAt: dbDelivery.created_at,
    }
  }

  // === DONNÉES MOCKÉES (FALLBACK) ===

  private getMockOrders(): Order[] {
    return [
      {
        id: 'CMD001',
        customer: 'Marie Dubois',
        email: 'marie.dubois@email.com',
        phone: '+33 6 12 34 56 78',
        items: [
          { name: 'Couscous Royal', quantity: 1, price: 18.50 },
          { name: 'Tajine Agneau', quantity: 1, price: 22.00 },
          { name: 'Thé à la Menthe', quantity: 2, price: 5.30 }
        ],
        total: 45.80,
        status: 'in_transit' as const,
        paymentStatus: 'Payé' as const,
        orderDate: '2024-07-23',
        orderTime: '14:30',
        deliveryAddress: '15 Rue de la Paix, 75001 Paris',
        deliveryTime: '15:30',
        notes: 'Sans piment dans le tajine'
      },
      // Ajouter d'autres commandes mockées...
    ]
  }

  private getMockDeliveries(): Delivery[] {
    return [
      {
        id: 'LIV001',
        orderId: 'CMD001',
        customer: 'Marie Dubois',
        phone: '+225 07 12 34 56 78',
        address: 'Cocody, Riviera Golf, Villa 25',
        coordinates: { lat: 5.3717, lng: -4.0078 },
        deliveryTime: '15:30',
        estimatedDelivery: '15:45',
        status: 'in_transit',
        driverId: 'DRV001',
        driverName: 'Kouassi Jean',
        driverPhone: '+225 05 98 76 54 32',
        deliveryZone: 'Cocody',
        notes: 'Appeler en arrivant',
        createdAt: '2024-07-23T14:30:00Z'
      },
      // Ajouter d'autres livraisons mockées...
    ]
  }

  private getMockDrivers(): Driver[] {
    return [
      {
        id: 'DRV001',
        name: 'Kouassi Jean',
        phone: '+225 05 98 76 54 32',
        email: 'jean.kouassi@terrano.com',
        status: 'busy',
        assignedZone: 'Cocody',
        vehicleType: 'moto',
        vehicleNumber: 'MT-001-AB',
        rating: 4.8,
        totalDeliveries: 234,
        createdAt: '2024-01-15T00:00:00Z'
      },
      // Ajouter d'autres livreurs mockés...
    ]
  }
}

// Instance singleton
export const db = new DatabaseService()
