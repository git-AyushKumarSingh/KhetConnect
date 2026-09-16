/**
 * KhetConnect Mock Data Store
 * Streamlined data models with Pune region logistics & BigBasket/Instamart benchmarks
 */

export interface ProduceItem {
  id: string;
  farmerId: string;
  farmerName: string;
  farmerPhone: string;
  farmerFpo: string;
  cropName: string;
  variety: string;
  category: 'VEGETABLES' | 'FRUITS' | 'GRAINS_CEREALS' | 'PULSES_LEGUMES' | 'SPICES' | 'ORGANIC_SPECIALTY';
  quantityKg: number;
  minOrderQuantityKg: number;
  basePricePerKg: number; // KhetConnect direct price
  bigBasketPricePerKg: number; // BigBasket benchmark price
  instamartPricePerKg: number; // Swiggy Instamart benchmark price
  harvestDate: string;
  shelfLifeDays: number;
  locationLat: number;
  locationLng: number;
  locationName: string;
  state: string;
  district: string;
  imageQualityScore: number;
  qualityGrade: string;
  organicCertified: boolean;
  imageUrl: string;
  status: 'AVAILABLE' | 'COMMITTED' | 'SOLD_OUT';
  freshnessScore: number;
}

export interface DeliveryAddress {
  fullName: string;
  phone: string;
  flatOrHouseNo: string;
  streetName: string;
  landmark: string;
  city: string;
  pincode: string;
  state: string;
}

export interface OrderRecord {
  id: string;
  buyerId: string;
  buyerName: string;
  buyerType: 'BUYER_RETAIL' | 'BUYER_BULK';
  items: Array<{
    produceId: string;
    cropName: string;
    quantityKg: number;
    unitPrice: number;
    imageUrl: string;
    farmerName: string;
    itemSubtotal: number;
    b2bDiscountAmount: number; // 3% auto discount if itemSubtotal >= 2500 in B2B
  }>;
  subtotalAmount: number;
  totalB2BDiscountAmount: number;
  deliveryFee: number;
  totalAmount: number;
  status: 'PLACED' | 'CLUSTERED' | 'IN_TRANSIT' | 'DELIVERED';
  paymentMethod: 'UPI' | 'CARD' | 'NET_BANKING' | 'CASH_ON_DELIVERY' | 'B2B_CREDIT';
  paymentStatus: 'PAID' | 'PENDING_ON_DELIVERY' | 'INVOICE_15_DAYS';
  deliveryAddress: DeliveryAddress;
  createdAt: string;
  tripId?: string;
}

export interface UserPersona {
  id: string;
  name: string;
  role: 'BUYER_RETAIL' | 'FARMER' | 'BUYER_BULK';
  phone: string;
  email: string;
  state: string;
  district: string;
  avatarUrl: string;
  defaultAddress?: DeliveryAddress;
}

// 2 Primary User Identities: Priya Sharma (Consumer) & Balasaheb Patil (Farmer)
export const INITIAL_USERS: UserPersona[] = [
  {
    id: 'usr_priya_01',
    name: 'Priya Sharma',
    role: 'BUYER_RETAIL',
    phone: '+91 98330 67890',
    email: 'priya.sharma@gmail.com',
    state: 'Maharashtra',
    district: 'Pune',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces',
    defaultAddress: {
      fullName: 'Priya Sharma',
      phone: '+91 98330 67890',
      flatOrHouseNo: 'Flat 804, Tower B, Amanora Park Town',
      streetName: 'Hadapsar Bypass Road',
      landmark: 'Near Amanora Mall',
      city: 'Pune',
      pincode: '411028',
      state: 'Maharashtra',
    },
  },
  {
    id: 'usr_farmer_01',
    name: 'Balasaheb Patil',
    role: 'FARMER',
    phone: '+91 98220 12345',
    email: 'balasaheb.patil@khetconnect.in',
    state: 'Maharashtra',
    district: 'Pune (Junnar Belt)',
    avatarUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&h=200&fit=crop&crop=faces',
  },
  {
    id: 'usr_buyer_bulk_01',
    name: 'Vikram Singhania (B2B Procurement)',
    role: 'BUYER_BULK',
    phone: '+91 98200 56789',
    email: 'procurement@tajbistro-group.com',
    state: 'Maharashtra',
    district: 'Pune',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop&crop=faces',
    defaultAddress: {
      fullName: 'Vikram Singhania (Taj Bistro)',
      phone: '+91 98200 56789',
      flatOrHouseNo: 'Central Kitchen Hub, Plot 42',
      streetName: 'Hinjewadi Phase 2 IT Park',
      landmark: 'Opp. Infosys Gate 1',
      city: 'Pune',
      pincode: '411057',
      state: 'Maharashtra',
    },
  },
];

export const INITIAL_PRODUCE: ProduceItem[] = [
  {
    id: 'prod_01',
    farmerId: 'usr_farmer_01',
    farmerName: 'Balasaheb Patil',
    farmerPhone: '+91 98220 12345',
    farmerFpo: 'Shivneri Farmer Producer Co.',
    cropName: 'Nashik Red Onions (Garwa)',
    variety: 'Garwa / Gavran Red',
    category: 'VEGETABLES',
    quantityKg: 3500,
    minOrderQuantityKg: 5,
    basePricePerKg: 36.1, // 5% cheaper than Instamart/BigBasket (₹38/kg)
    bigBasketPricePerKg: 38.0,
    instamartPricePerKg: 40.0,
    harvestDate: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0],
    shelfLifeDays: 60,
    locationLat: 19.0067,
    locationLng: 73.9392,
    locationName: 'Manchar, Pune',
    state: 'Maharashtra',
    district: 'Pune',
    imageQualityScore: 96.5,
    qualityGrade: 'Grade A Select',
    organicCertified: false,
    imageUrl: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600&h=450&fit=crop',
    status: 'AVAILABLE',
    freshnessScore: 98,
  },
  {
    id: 'prod_02',
    farmerId: 'usr_farmer_01',
    farmerName: 'Balasaheb Patil',
    farmerPhone: '+91 98220 12345',
    farmerFpo: 'Shivneri Farmer Producer Co.',
    cropName: 'Junnar Vine-Ripe Tomatoes',
    variety: 'Abhinav Hybrid (Firm Pulp)',
    category: 'VEGETABLES',
    quantityKg: 2200,
    minOrderQuantityKg: 5,
    basePricePerKg: 39.9, // 5% cheaper than BigBasket ₹42
    bigBasketPricePerKg: 42.0,
    instamartPricePerKg: 44.0,
    harvestDate: new Date(Date.now() - 1 * 86400000).toISOString().split('T')[0],
    shelfLifeDays: 10,
    locationLat: 19.2087,
    locationLng: 73.8765,
    locationName: 'Otur, Junnar, Pune',
    state: 'Maharashtra',
    district: 'Pune',
    imageQualityScore: 97.0,
    qualityGrade: 'Grade A Farm Fresh',
    organicCertified: true,
    imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&h=450&fit=crop',
    status: 'AVAILABLE',
    freshnessScore: 99,
  },
  {
    id: 'prod_03',
    farmerId: 'usr_farmer_01',
    farmerName: 'Balasaheb Patil',
    farmerPhone: '+91 98220 12345',
    farmerFpo: 'Shivneri Farmer Producer Co.',
    cropName: 'Malwa Sharbati Golden Wheat',
    variety: 'PBW 725 Premium Lustre',
    category: 'GRAINS_CEREALS',
    quantityKg: 8500,
    minOrderQuantityKg: 25,
    basePricePerKg: 51.3, // 5% cheaper than BigBasket ₹54
    bigBasketPricePerKg: 54.0,
    instamartPricePerKg: 56.0,
    harvestDate: new Date(Date.now() - 14 * 86400000).toISOString().split('T')[0],
    shelfLifeDays: 365,
    locationLat: 18.8400,
    locationLng: 73.9000,
    locationName: 'Khed, Pune',
    state: 'Maharashtra',
    district: 'Pune',
    imageQualityScore: 98.0,
    qualityGrade: 'Grade A+ Certified',
    organicCertified: true,
    imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&h=450&fit=crop',
    status: 'AVAILABLE',
    freshnessScore: 99,
  },
  {
    id: 'prod_04',
    farmerId: 'usr_farmer_01',
    farmerName: 'Balasaheb Patil',
    farmerPhone: '+91 98220 12345',
    farmerFpo: 'Shivneri Farmer Producer Co.',
    cropName: 'Fresh Sonaka Green Grapes',
    variety: 'Sonaka Seedless (TSS 20+)',
    category: 'FRUITS',
    quantityKg: 2400,
    minOrderQuantityKg: 5,
    basePricePerKg: 114.0, // 5% cheaper than BigBasket ₹120
    bigBasketPricePerKg: 120.0,
    instamartPricePerKg: 130.0,
    harvestDate: new Date(Date.now() - 1 * 86400000).toISOString().split('T')[0],
    shelfLifeDays: 14,
    locationLat: 19.2600,
    locationLng: 73.9100,
    locationName: 'Junnar Hills, Pune',
    state: 'Maharashtra',
    district: 'Pune',
    imageQualityScore: 97.5,
    qualityGrade: 'Export Spec Grade A',
    organicCertified: true,
    imageUrl: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=600&h=450&fit=crop',
    status: 'AVAILABLE',
    freshnessScore: 97,
  },
  {
    id: 'prod_05',
    farmerId: 'usr_farmer_01',
    farmerName: 'Balasaheb Patil',
    farmerPhone: '+91 98220 12345',
    farmerFpo: 'Shivneri Farmer Producer Co.',
    cropName: 'Pune Green Bell Capsicum',
    variety: 'Indra F1 Hybrid',
    category: 'VEGETABLES',
    quantityKg: 1400,
    minOrderQuantityKg: 5,
    basePricePerKg: 64.6, // 5% cheaper than BigBasket ₹68
    bigBasketPricePerKg: 68.0,
    instamartPricePerKg: 72.0,
    harvestDate: new Date(Date.now() - 1 * 86400000).toISOString().split('T')[0],
    shelfLifeDays: 12,
    locationLat: 19.0067,
    locationLng: 73.9392,
    locationName: 'Manchar, Pune',
    state: 'Maharashtra',
    district: 'Pune',
    imageQualityScore: 95.0,
    qualityGrade: 'Grade A Crispy',
    organicCertified: false,
    imageUrl: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=600&h=450&fit=crop',
    status: 'AVAILABLE',
    freshnessScore: 96,
  },
  {
    id: 'prod_06',
    farmerId: 'usr_farmer_01',
    farmerName: 'Balasaheb Patil',
    farmerPhone: '+91 98220 12345',
    farmerFpo: 'Shivneri Farmer Producer Co.',
    cropName: 'Saswad Sweet Figs & Pomegranates',
    variety: 'Poona Fig & Bhagwa Ruby',
    category: 'FRUITS',
    quantityKg: 1800,
    minOrderQuantityKg: 5,
    basePricePerKg: 152.0, // 5% cheaper than BigBasket ₹160
    bigBasketPricePerKg: 160.0,
    instamartPricePerKg: 175.0,
    harvestDate: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0],
    shelfLifeDays: 15,
    locationLat: 18.3400,
    locationLng: 74.0300,
    locationName: 'Saswad, Pune',
    state: 'Maharashtra',
    district: 'Pune',
    imageQualityScore: 98.0,
    qualityGrade: 'GI Tagged Purandar Standard',
    organicCertified: true,
    imageUrl: 'https://images.unsplash.com/photo-1541344999736-83eca872f241?w=600&h=450&fit=crop',
    status: 'AVAILABLE',
    freshnessScore: 98,
  },
];

export const INITIAL_ORDERS: OrderRecord[] = [
  {
    id: 'ORD-PUNE-9021',
    buyerId: 'usr_priya_01',
    buyerName: 'Priya Sharma',
    buyerType: 'BUYER_RETAIL',
    items: [
      {
        produceId: 'prod_01',
        cropName: 'Nashik Red Onions (Garwa)',
        quantityKg: 10,
        unitPrice: 36.1,
        imageUrl: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=200&fit=crop',
        farmerName: 'Balasaheb Patil',
        itemSubtotal: 361,
        b2bDiscountAmount: 0,
      },
      {
        produceId: 'prod_02',
        cropName: 'Junnar Vine-Ripe Tomatoes',
        quantityKg: 10,
        unitPrice: 39.9,
        imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=200&fit=crop',
        farmerName: 'Balasaheb Patil',
        itemSubtotal: 399,
        b2bDiscountAmount: 0,
      },
    ],
    subtotalAmount: 760,
    totalB2BDiscountAmount: 0,
    deliveryFee: 0,
    totalAmount: 760,
    status: 'IN_TRANSIT',
    paymentMethod: 'UPI',
    paymentStatus: 'PAID',
    deliveryAddress: {
      fullName: 'Priya Sharma',
      phone: '+91 98330 67890',
      flatOrHouseNo: 'Flat 804, Tower B, Amanora Park Town',
      streetName: 'Hadapsar Bypass Road',
      landmark: 'Near Amanora Mall',
      city: 'Pune',
      pincode: '411028',
      state: 'Maharashtra',
    },
    createdAt: new Date(Date.now() - 3 * 3600000).toISOString(),
    tripId: 'TRIP-PUNE-01',
  },
];
