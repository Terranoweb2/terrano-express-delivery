export interface Order {
  id: string;
  customer: string;
  email?: string;
  phone: string;
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  status: 'preparing' | 'ready' | 'picked_up' | 'in_transit' | 'arrived' | 'delivered' | 'cancelled';
  paymentStatus?: string;
  orderDate?: string;
  orderTime?: string;
  deliveryAddress?: string;
  deliveryTime?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
  driver?: {
    name: string;
    phone: string;
    vehicleType: 'moto' | 'voiture' | 'velo';
    rating: number;
  };
  addresses?: {
    restaurant: string;
    delivery: string;
  };
}

export interface Reservation {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  reservationDate: string;
  reservationTime: string;
  partySize: number;
  specialRequests?: string;
  tableNumber?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'seated' | 'no_show';
  createdAt?: string;
  updatedAt?: string;
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  email: string;
  vehicleType: 'moto' | 'voiture' | 'velo';
  vehicleNumber: string;
  rating: number;
  totalDeliveries: number;
  status: 'available' | 'busy' | 'offline';
  assignedZone: string;
  currentLocation?: {
    lat: number;
    lng: number;
  };
  createdAt: string;
}

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'manager';
  lastLogin?: string;
  createdAt: string;
}

export interface Stats {
  totalOrders: number;
  todayOrders: number;
  revenue: number;
  todayRevenue: number;
  activeDrivers: number;
  completedOrders: number;
  pendingOrders: number;
  averageDeliveryTime: number;
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  description?: string;
  image?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
}

export interface Delivery {
  id: string;
  orderId: string;
  driverId: string;
  driverName?: string;
  driverPhone?: string;
  customer?: string;
  phone?: string;
  address?: string;
  deliveryZone?: string;
  notes?: string;
  status: 'assigned' | 'picked_up' | 'in_transit' | 'delivered';
  pickupTime?: string;
  deliveryTime?: string;
  estimatedDelivery: string;
  actualDelivery?: string;
  createdAt?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
}

export interface Location {
  lat: number;
  lng: number;
  address: string;
}

export interface PaymentData {
  amount: number;
  currency: string;
  paymentMethod: string;
  transactionId?: string;
  timestamp?: string;
  providerDetails?: {
    provider?: string;
    phoneNumber?: string;
    cardLast4?: string;
  };
  status: 'pending' | 'completed' | 'failed';
}
