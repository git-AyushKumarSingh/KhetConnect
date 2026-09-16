import { create } from 'zustand';
import { ProduceItem, OrderRecord, UserPersona, DeliveryAddress, INITIAL_PRODUCE, INITIAL_ORDERS, INITIAL_USERS } from '@/lib/db/mock-data';
import { RouteOptimizationResult } from '@/lib/algorithms/vrp-solver';

export interface CartItem {
  produce: ProduceItem;
  quantityKg: number;
}

interface AppState {
  // Active User / Identity (Priya vs Balasaheb vs B2B)
  currentUser: UserPersona;
  setCurrentUserRole: (role: UserPersona['role']) => void;
  setCurrentUser: (user: UserPersona) => void;

  // Delivery Address
  selectedAddress: DeliveryAddress;
  setSelectedAddress: (addr: DeliveryAddress) => void;

  // Payment Option
  selectedPaymentMethod: 'UPI' | 'CARD' | 'NET_BANKING' | 'CASH_ON_DELIVERY' | 'B2B_CREDIT';
  setSelectedPaymentMethod: (method: 'UPI' | 'CARD' | 'NET_BANKING' | 'CASH_ON_DELIVERY' | 'B2B_CREDIT') => void;

  // Language
  language: 'en' | 'hi' | 'mr';
  setLanguage: (lang: 'en' | 'hi' | 'mr') => void;

  // Produce Listings
  produces: ProduceItem[];
  addProduce: (produce: Omit<ProduceItem, 'id' | 'freshnessScore'>) => void;
  updateProduceStatus: (id: string, status: ProduceItem['status']) => void;

  // Orders
  orders: OrderRecord[];
  createOrder: (order: Omit<OrderRecord, 'id' | 'createdAt'>) => OrderRecord;

  // Cart
  cart: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (produce: ProduceItem, quantityKg: number) => void;
  removeFromCart: (produceId: string) => void;
  updateCartQuantity: (produceId: string, quantityKg: number) => void;
  clearCart: () => void;

  // Logistics & Active Optimization (Pune Region)
  activeTrip: RouteOptimizationResult | null;
  setActiveTrip: (trip: RouteOptimizationResult | null) => void;
  tripStatus: 'IDLE' | 'OPTIMIZING' | 'DISPATCHED' | 'IN_TRANSIT' | 'COMPLETED';
  setTripStatus: (status: 'IDLE' | 'OPTIMIZING' | 'DISPATCHED' | 'IN_TRANSIT' | 'COMPLETED') => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  currentUser: INITIAL_USERS[0], // default to Priya Sharma (Consumer)
  setCurrentUserRole: (role) => {
    const matched = INITIAL_USERS.find((u) => u.role === role) || INITIAL_USERS[0];
    set({ 
      currentUser: matched,
      selectedAddress: matched.defaultAddress || INITIAL_USERS[0].defaultAddress!,
    });
  },
  setCurrentUser: (user) => {
    set({
      currentUser: user,
      selectedAddress: user.defaultAddress || INITIAL_USERS[0].defaultAddress!,
    });
  },

  selectedAddress: INITIAL_USERS[0].defaultAddress!,
  setSelectedAddress: (addr) => set({ selectedAddress: addr }),

  selectedPaymentMethod: 'UPI',
  setSelectedPaymentMethod: (method) => set({ selectedPaymentMethod: method }),

  language: 'en',
  setLanguage: (lang) => set({ language: lang }),

  produces: INITIAL_PRODUCE,
  addProduce: (item) => {
    const newItem: ProduceItem = {
      ...item,
      id: `prod_${Date.now()}`,
      freshnessScore: Math.min(100, Math.round(item.imageQualityScore || 95)),
    };
    set((state) => ({ produces: [newItem, ...state.produces] }));
  },
  updateProduceStatus: (id, status) => {
    set((state) => ({
      produces: state.produces.map((p) => (p.id === id ? { ...p, status } : p)),
    }));
  },

  orders: INITIAL_ORDERS,
  createOrder: (orderData) => {
    const newOrder: OrderRecord = {
      ...orderData,
      id: `ORD-PUNE-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
    };
    set((state) => ({ orders: [newOrder, ...state.orders] }));
    return newOrder;
  },

  cart: [],
  isCartOpen: false,
  setIsCartOpen: (open) => set({ isCartOpen: open }),
  addToCart: (produce, quantityKg) => {
    set((state) => {
      const existing = state.cart.find((c) => c.produce.id === produce.id);
      if (existing) {
        return {
          cart: state.cart.map((c) =>
            c.produce.id === produce.id
              ? { ...c, quantityKg: c.quantityKg + quantityKg }
              : c
          ),
          isCartOpen: true,
        };
      }
      return {
        cart: [...state.cart, { produce, quantityKg }],
        isCartOpen: true,
      };
    });
  },
  removeFromCart: (produceId) => {
    set((state) => ({
      cart: state.cart.filter((c) => c.produce.id !== produceId),
    }));
  },
  updateCartQuantity: (produceId, quantityKg) => {
    if (quantityKg <= 0) {
      get().removeFromCart(produceId);
      return;
    }
    set((state) => ({
      cart: state.cart.map((c) =>
        c.produce.id === produceId ? { ...c, quantityKg } : c
      ),
    }));
  },
  clearCart: () => set({ cart: [] }),

  activeTrip: null,
  setActiveTrip: (trip) => set({ activeTrip: trip }),
  tripStatus: 'IDLE',
  setTripStatus: (status) => set({ tripStatus: status }),
}));
