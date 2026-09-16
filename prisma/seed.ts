import { PrismaClient, Role, ProductCategory, ProduceStatus, OrderStatus, PaymentStatus, TripStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting KrishiDirect Seed...');

  // Clean existing tables (if any)
  try {
    await prisma.orderItem.deleteMany({});
    await prisma.order.deleteMany({});
    await prisma.logisticsTrip.deleteMany({});
    await prisma.farmProduce.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.mandiPriceRecord.deleteMany({});
    await prisma.demandForecastRecord.deleteMany({});
  } catch (e) {
    console.log('Tables empty or initializing for first run...');
  }

  // 1. Seed Users (Farmers, Buyers, Drivers, Admin)
  const farmer1 = await prisma.user.create({
    data: {
      id: 'usr_farmer_01',
      name: 'Balasaheb Patil',
      phone: '+919822012345',
      email: 'balasaheb.patil@sahyadri-agro.in',
      role: Role.FARMER,
      state: 'Maharashtra',
      district: 'Nashik',
      villageOrCity: 'Niphad',
      farmSizeAcres: 12.5,
      fpoName: 'Godavari Valley Kisan Producer Co.',
      avatarUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&h=200&fit=crop&crop=faces',
    },
  });

  const farmer2 = await prisma.user.create({
    data: {
      id: 'usr_farmer_02',
      name: 'Ramesh Kulkarni',
      phone: '+919823023456',
      email: 'ramesh.kulkarni@puneagro.org',
      role: Role.FARMER,
      state: 'Maharashtra',
      district: 'Pune',
      villageOrCity: 'Junnar',
      farmSizeAcres: 8.0,
      fpoName: 'Shivneri Veg Grower Federation',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=faces',
    },
  });

  const farmer3 = await prisma.user.create({
    data: {
      id: 'usr_farmer_03',
      name: 'Sardar Gurpreet Singh',
      phone: '+919814034567',
      email: 'gurpreet.farm@punjabkrishi.in',
      role: Role.FARMER,
      state: 'Punjab',
      district: 'Ludhiana',
      villageOrCity: 'Jagraon',
      farmSizeAcres: 28.0,
      fpoName: 'Malwa Golden Grain FPO',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=faces',
    },
  });

  const farmer4 = await prisma.user.create({
    data: {
      id: 'usr_farmer_04',
      name: 'Anandgowda Patil',
      phone: '+919448045678',
      email: 'anand.kolar@karnatakafarms.in',
      role: Role.FARMER,
      state: 'Karnataka',
      district: 'Kolar',
      villageOrCity: 'Bangarapet',
      farmSizeAcres: 15.0,
      fpoName: 'Kolar Tomato & Veg Cluster',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=faces',
    },
  });

  const buyerBulk = await prisma.user.create({
    data: {
      id: 'usr_buyer_bulk_01',
      name: 'Vikram Singhania',
      phone: '+919820056789',
      email: 'procurement@tajbistro-group.com',
      role: Role.BUYER_BULK,
      state: 'Maharashtra',
      district: 'Mumbai',
      villageOrCity: 'Bandra Kurla Complex',
      businessName: 'Taj Bistro & Hospitality Chain',
      gstin: '27AABCT1234F1Z8',
      avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop&crop=faces',
    },
  });

  const buyerRetail = await prisma.user.create({
    data: {
      id: 'usr_buyer_retail_01',
      name: 'Priya Sharma',
      phone: '+919833067890',
      email: 'priya.sharma@gmail.com',
      role: Role.BUYER_RETAIL,
      state: 'Maharashtra',
      district: 'Mumbai',
      villageOrCity: 'Powai',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces',
    },
  });

  const driver = await prisma.user.create({
    data: {
      id: 'usr_driver_01',
      name: 'Santosh Yadav',
      phone: '+919890078901',
      email: 'santosh.logistics@krishidirect.in',
      role: Role.LOGISTICS_DRIVER,
      state: 'Maharashtra',
      district: 'Nashik',
      villageOrCity: 'Nashik Central',
      avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=faces',
    },
  });

  const admin = await prisma.user.create({
    data: {
      id: 'usr_admin_01',
      name: 'Aditi Deshmukh (Ops Lead)',
      phone: '+919821089012',
      email: 'aditi.admin@krishidirect.in',
      role: Role.ADMIN,
      state: 'Maharashtra',
      district: 'Mumbai',
      villageOrCity: 'Nariman Point',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=faces',
    },
  });

  // 2. Seed Realistic Indian Farm Produce Listings
  const produces = [
    {
      id: 'prod_01',
      farmerId: farmer1.id,
      cropName: 'Nashik Red Onions (Garwa)',
      variety: 'Garwa / Gavran Red',
      category: ProductCategory.VEGETABLES,
      quantityKg: 3500,
      minOrderQuantityKg: 25,
      basePricePerKg: 26.0,
      mandiReferencePrice: 17.5,
      harvestDate: new Date(Date.now() - 2 * 86400000),
      shelfLifeDays: 60,
      locationLat: 19.9975,
      locationLng: 73.7898,
      locationName: 'Niphad, Nashik, Maharashtra',
      imageQualityScore: 94.5,
      qualityGrade: 'Grade A Export',
      organicCertified: false,
      imageUrl: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600&h=450&fit=crop',
      status: ProduceStatus.AVAILABLE,
    },
    {
      id: 'prod_02',
      farmerId: farmer2.id,
      cropName: 'Junnar Vine-Ripe Tomatoes',
      variety: 'Abhinav Hybrid (Firm Pulp)',
      category: ProductCategory.VEGETABLES,
      quantityKg: 1800,
      minOrderQuantityKg: 10,
      basePricePerKg: 29.0,
      mandiReferencePrice: 19.0,
      harvestDate: new Date(Date.now() - 1 * 86400000),
      shelfLifeDays: 10,
      locationLat: 19.2087,
      locationLng: 73.8765,
      locationName: 'Otur, Junnar, Pune, Maharashtra',
      imageQualityScore: 96.0,
      qualityGrade: 'Grade A Table Top',
      organicCertified: true,
      imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&h=450&fit=crop',
      status: ProduceStatus.AVAILABLE,
    },
    {
      id: 'prod_03',
      farmerId: farmer3.id,
      cropName: 'Malwa Sharbati Wheat (Golden Grain)',
      variety: 'PBW 725 Premium Lustre',
      category: ProductCategory.GRAINS_CEREALS,
      quantityKg: 8500,
      minOrderQuantityKg: 50,
      basePricePerKg: 38.0,
      mandiReferencePrice: 26.5,
      harvestDate: new Date(Date.now() - 14 * 86400000),
      shelfLifeDays: 365,
      locationLat: 30.9010,
      locationLng: 75.8573,
      locationName: 'Jagraon, Ludhiana, Punjab',
      imageQualityScore: 98.0,
      qualityGrade: 'Grade A+ Certified',
      organicCertified: true,
      imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&h=450&fit=crop',
      status: ProduceStatus.AVAILABLE,
    },
    {
      id: 'prod_04',
      farmerId: farmer1.id,
      cropName: 'Nashik Sonaka Green Grapes',
      variety: 'Sonaka Seedless (Sweet TSS 20+)',
      category: ProductCategory.FRUITS,
      quantityKg: 2400,
      minOrderQuantityKg: 10,
      basePricePerKg: 85.0,
      mandiReferencePrice: 58.0,
      harvestDate: new Date(Date.now() - 1 * 86400000),
      shelfLifeDays: 14,
      locationLat: 20.0833,
      locationLng: 74.0000,
      locationName: 'Dindori, Nashik, Maharashtra',
      imageQualityScore: 97.5,
      qualityGrade: 'Export Spec Europe Standard',
      organicCertified: true,
      imageUrl: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=600&h=450&fit=crop',
      status: ProduceStatus.AVAILABLE,
    },
    {
      id: 'prod_05',
      farmerId: farmer4.id,
      cropName: 'Kolar Green Bell Capsicum',
      variety: 'Indra F1 Hybrid',
      category: ProductCategory.VEGETABLES,
      quantityKg: 1200,
      minOrderQuantityKg: 15,
      basePricePerKg: 48.0,
      mandiReferencePrice: 32.0,
      harvestDate: new Date(Date.now() - 1 * 86400000),
      shelfLifeDays: 12,
      locationLat: 13.1367,
      locationLng: 78.1291,
      locationName: 'Bangarapet, Kolar, Karnataka',
      imageQualityScore: 93.0,
      qualityGrade: 'Grade A Crispy',
      organicCertified: false,
      imageUrl: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=600&h=450&fit=crop',
      status: ProduceStatus.AVAILABLE,
    },
    {
      id: 'prod_06',
      farmerId: farmer1.id,
      cropName: 'Sangola Bhagwa Pomegranates',
      variety: 'Ruby Red Bhagwa Special',
      category: ProductCategory.FRUITS,
      quantityKg: 3100,
      minOrderQuantityKg: 20,
      basePricePerKg: 115.0,
      mandiReferencePrice: 82.0,
      harvestDate: new Date(Date.now() - 3 * 86400000),
      shelfLifeDays: 25,
      locationLat: 17.4333,
      locationLng: 75.1833,
      locationName: 'Sangola, Solapur, Maharashtra',
      imageQualityScore: 99.0,
      qualityGrade: 'Grade A+ Export Deluxe',
      organicCertified: true,
      imageUrl: 'https://images.unsplash.com/photo-1541344999736-83eca872f241?w=600&h=450&fit=crop',
      status: ProduceStatus.AVAILABLE,
    },
    {
      id: 'prod_07',
      farmerId: farmer3.id,
      cropName: 'Sangrur Royal Basmati Rice (1121)',
      variety: 'Pusa 1121 Extra Long Grain (8.4mm)',
      category: ProductCategory.GRAINS_CEREALS,
      quantityKg: 6000,
      minOrderQuantityKg: 50,
      basePricePerKg: 82.0,
      mandiReferencePrice: 61.0,
      harvestDate: new Date(Date.now() - 30 * 86400000),
      shelfLifeDays: 730,
      locationLat: 30.2458,
      locationLng: 75.8421,
      locationName: 'Sunam, Sangrur, Punjab',
      imageQualityScore: 98.5,
      qualityGrade: 'Aged 1 Year Export Grade',
      organicCertified: false,
      imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&h=450&fit=crop',
      status: ProduceStatus.AVAILABLE,
    },
    {
      id: 'prod_08',
      farmerId: farmer2.id,
      cropName: 'Manchar Crisp Green Cauliflower',
      variety: 'Snowball 16 Compact Head',
      category: ProductCategory.VEGETABLES,
      quantityKg: 1400,
      minOrderQuantityKg: 10,
      basePricePerKg: 28.0,
      mandiReferencePrice: 18.0,
      harvestDate: new Date(Date.now() - 1 * 86400000),
      shelfLifeDays: 8,
      locationLat: 19.0067,
      locationLng: 73.9392,
      locationName: 'Manchar, Pune, Maharashtra',
      imageQualityScore: 95.0,
      qualityGrade: 'Grade A Snow White',
      organicCertified: false,
      imageUrl: 'https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?w=600&h=450&fit=crop',
      status: ProduceStatus.AVAILABLE,
    },
    {
      id: 'prod_09',
      farmerId: farmer4.id,
      cropName: 'Shimla Royal Delicious Apples',
      variety: 'Royal Delicious Red (Crisp)',
      category: ProductCategory.FRUITS,
      quantityKg: 4200,
      minOrderQuantityKg: 20,
      basePricePerKg: 135.0,
      mandiReferencePrice: 95.0,
      harvestDate: new Date(Date.now() - 5 * 86400000),
      shelfLifeDays: 40,
      locationLat: 31.1048,
      locationLng: 77.1734,
      locationName: 'Kotgarh, Shimla, Himachal Pradesh',
      imageQualityScore: 96.8,
      qualityGrade: 'Grade A High Altitude',
      organicCertified: true,
      imageUrl: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&h=450&fit=crop',
      status: ProduceStatus.AVAILABLE,
    },
    {
      id: 'prod_10',
      farmerId: farmer1.id,
      cropName: 'Unpolished Desi Chana Dal',
      variety: 'Desi Brown Chickpea (High Protein)',
      category: ProductCategory.PULSES_LEGUMES,
      quantityKg: 3000,
      minOrderQuantityKg: 25,
      basePricePerKg: 76.0,
      mandiReferencePrice: 58.0,
      harvestDate: new Date(Date.now() - 20 * 86400000),
      shelfLifeDays: 365,
      locationLat: 20.1500,
      locationLng: 74.2000,
      locationName: 'Yeola, Nashik, Maharashtra',
      imageQualityScore: 97.0,
      qualityGrade: '100% Zero Polish Raw Grain',
      organicCertified: true,
      imageUrl: 'https://images.unsplash.com/photo-1585994192701-f1a505c817ea?w=600&h=450&fit=crop',
      status: ProduceStatus.AVAILABLE,
    },
  ];

  for (const item of produces) {
    await prisma.farmProduce.create({ data: item });
  }

  // 3. Seed Sample Orders with Transparent 82% / 12% / 6% Cost Allocation
  const sampleOrder1 = await prisma.order.create({
    data: {
      id: 'ord_bulk_001',
      buyerId: buyerBulk.id,
      buyerType: Role.BUYER_BULK,
      totalAmount: 26000.0,
      farmerPayoutAmount: 21320.0, // 82%
      logisticsFee: 3120.0,        // 12%
      platformFee: 1560.0,         // 6%
      status: OrderStatus.IN_TRANSIT,
      paymentStatus: PaymentStatus.ESCROW_HELD,
      deliveryAddress: 'Central Kitchen, Taj Bistro, BKC, Mumbai',
      deliveryLat: 19.0657,
      deliveryLng: 72.8687,
      deliveryDistrict: 'Mumbai Suburban',
      deliveryState: 'Maharashtra',
    },
  });

  await prisma.orderItem.create({
    data: {
      orderId: sampleOrder1.id,
      produceId: 'prod_01',
      quantityKg: 1000,
      unitPrice: 26.0,
    },
  });

  const sampleOrder2 = await prisma.order.create({
    data: {
      id: 'ord_ret_002',
      buyerId: buyerRetail.id,
      buyerType: Role.BUYER_RETAIL,
      totalAmount: 1450.0,
      farmerPayoutAmount: 1189.0, // 82%
      logisticsFee: 174.0,        // 12%
      platformFee: 87.0,          // 6%
      status: OrderStatus.DELIVERED,
      paymentStatus: PaymentStatus.RELEASED_TO_FARMER,
      deliveryAddress: 'Tower 4, Hiranandani Gardens, Powai, Mumbai',
      deliveryLat: 19.1176,
      deliveryLng: 72.9060,
      deliveryDistrict: 'Mumbai Suburban',
      deliveryState: 'Maharashtra',
    },
  });

  await prisma.orderItem.create({
    data: {
      orderId: sampleOrder2.id,
      produceId: 'prod_02',
      quantityKg: 50,
      unitPrice: 29.0,
    },
  });

  // 4. Seed Logistics Trip Record
  await prisma.logisticsTrip.create({
    data: {
      id: 'trip_cvrp_001',
      driverId: driver.id,
      vehicleNumber: 'MH-15-EG-4921',
      vehicleType: 'Tata 407 (3.5T Cold-Box)',
      vehicleCapacityKg: 3500,
      currentLoadKg: 2800,
      routeWaypoints: [
        { name: 'Depot: Nashik Agro Hub', lat: 19.9975, lng: 73.7898, type: 'DEPOT' },
        { name: 'Balasaheb Farm (Onions 1500kg)', lat: 20.0833, lng: 74.0000, type: 'PICKUP' },
        { name: 'Ramesh Farm (Tomatoes 800kg)', lat: 19.2087, lng: 73.8765, type: 'PICKUP' },
        { name: 'Destination: Vashi APMC Mumbai', lat: 19.0760, lng: 72.9980, type: 'DROP' },
      ],
      optimizedOrder: [0, 1, 2, 3],
      status: TripStatus.IN_TRANSIT,
      totalDistanceKm: 184.6,
      estimatedFuelSaved: 38.4,
      carbonEmissionsSavedKg: 102.9,
      originHub: 'Nashik Agri-Logistics Hub',
      destinationHub: 'Mumbai Vashi APMC Terminal',
    },
  });

  console.log('✅ KrishiDirect Database successfully seeded with rich agricultural records!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
