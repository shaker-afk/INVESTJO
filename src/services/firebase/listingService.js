/**
 * listingService.js
 * Abstraction layer for investment listing data.
 * Currently returns mock data; replace `fetchListings` internals
 * with real Firestore calls when backend is ready.
 *
 * Expected Firestore collection: "listings"
 * Each document maps 1-to-1 with the shape defined below.
 */

// ---------------------------------------------------------------------------
// Mock Data — mirrors the Firestore document structure
// ---------------------------------------------------------------------------
const MOCK_LISTINGS = [
  {
    id: 'listing_001',
    titleEn: 'Wadi Araba Solar Park',
    titleAr: 'حديقة وادي عربة الشمسية',
    descriptionEn:
      "Join the region's largest sovereign-backed renewable energy initiative. High-yield infrastructure project spanning 220 km².",
    descriptionAr:
      'انضم إلى أكبر مبادرة طاقة متجددة مدعومة سيادياً في المنطقة. مشروع بنية تحتية عالي العائد.',
    sector: 'Energy',
    sectorAr: 'طاقة',
    capitalMin: 100000,
    capitalMax: 500000,
    currency: 'JOD',
    isEcoFriendly: true,
    trendingCount: 1240,
    imageUrl: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&q=80',
    location: 'Wadi Araba, Jordan',
    targetCapitalization: 50000000,
    raisedAmount: 32000000,
    status: 'active',
    createdAt: '2025-01-15T08:00:00Z',
    updatedAt: '2025-03-10T12:00:00Z',
  },
  {
    id: 'listing_002',
    titleEn: 'Al-Qasr Heritage Boutique Hotel',
    titleAr: 'فندق القصر التراثي البوتيك',
    descriptionEn:
      'Revitalization of a historic Amman estate into a 5-star sustainable boutique experience blending Ottoman architecture with modern luxury.',
    descriptionAr:
      'إحياء مبنى تاريخي في عمان وتحويله إلى تجربة بوتيك خمس نجوم مستدامة تجمع بين العمارة العثمانية والفخامة الحديثة.',
    sector: 'Tourism',
    sectorAr: 'سياحة',
    capitalMin: 50000,
    capitalMax: 250000,
    currency: 'JOD',
    isEcoFriendly: true,
    trendingCount: 876,
    imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
    location: 'Jabal Amman, Jordan',
    targetCapitalization: 12000000,
    raisedAmount: 7500000,
    status: 'active',
    createdAt: '2025-02-01T08:00:00Z',
    updatedAt: '2025-03-12T09:00:00Z',
  },
  {
    id: 'listing_003',
    titleEn: 'Jordan Valley Hydroponics',
    titleAr: 'الزراعة المائية في وادي الأردن',
    descriptionEn:
      'Next-generation sustainable farming utilizing 90% less water for high-yield produce exports. Certified organic and carbon-neutral.',
    descriptionAr:
      'زراعة مستدامة من الجيل التالي تستخدم 90٪ أقل من المياه لتصدير المنتجات عالية الإنتاجية. عضوية معتمدة ومحايدة للكربون.',
    sector: 'Agriculture',
    sectorAr: 'زراعة',
    capitalMin: 25000,
    capitalMax: 100000,
    currency: 'JOD',
    isEcoFriendly: true,
    trendingCount: 542,
    imageUrl: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=800&q=80',
    location: 'Jordan Valley, Jordan',
    targetCapitalization: 5000000,
    raisedAmount: 2100000,
    status: 'active',
    createdAt: '2025-02-20T08:00:00Z',
    updatedAt: '2025-03-15T10:00:00Z',
  },
  {
    id: 'listing_004',
    titleEn: 'Aqaba Smart Logistics Hub',
    titleAr: 'مركز العقبة الذكي للخدمات اللوجستية',
    descriptionEn:
      'AI-driven maritime logistics optimization facility in the Aqaba Special Economic Zone. Projected 22% ROI annually.',
    descriptionAr:
      'منشأة تحسين الخدمات اللوجستية البحرية المدفوعة بالذكاء الاصطناعي في منطقة العقبة الاقتصادية الخاصة.',
    sector: 'Technology',
    sectorAr: 'تكنولوجيا',
    capitalMin: 75000,
    capitalMax: 300000,
    currency: 'JOD',
    isEcoFriendly: false,
    trendingCount: 1087,
    imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80',
    location: 'Aqaba, Jordan',
    targetCapitalization: 20000000,
    raisedAmount: 11500000,
    status: 'active',
    createdAt: '2025-01-28T08:00:00Z',
    updatedAt: '2025-03-18T11:00:00Z',
  },
  {
    id: 'listing_005',
    titleEn: 'Petra Digital Heritage Center',
    titleAr: 'مركز البتراء للتراث الرقمي',
    descriptionEn:
      'Immersive AR/VR tourism experience center at the UNESCO-listed Petra site. Backed by the Jordan Tourism Board.',
    descriptionAr:
      'مركز سياحي غامر للواقع المعزز/الافتراضي في موقع البتراء المدرج في اليونسكو. مدعوم من هيئة السياحة الأردنية.',
    sector: 'Tourism',
    sectorAr: 'سياحة',
    capitalMin: 50000,
    capitalMax: 150000,
    currency: 'JOD',
    isEcoFriendly: false,
    trendingCount: 734,
    // imageUrl is used for remote images (Firestore/Storage).
    // imageSource overrides it for local bundled assets (mock data only).
    // TODO: When migrating to Firestore, upload this image to Firebase Storage
    //       and replace imageSource with the resulting imageUrl.
    imageUrl: null,
    imageSource: require('../../../assets/images/petra-heritage.png'),
    location: 'Petra, Jordan',
    targetCapitalization: 8000000,
    raisedAmount: 4200000,
    status: 'active',
    createdAt: '2025-03-01T08:00:00Z',
    updatedAt: '2025-03-20T14:00:00Z',
  },
];

// ---------------------------------------------------------------------------
// Service Functions
// ---------------------------------------------------------------------------

/**
 * Fetches all investment listings.
 * TODO: Replace with:
 *   const snapshot = await firestore().collection('listings').orderBy('createdAt', 'desc').get();
 *   return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
 *
 * @returns {Promise<Array>} Array of listing objects
 */
export async function fetchListings() {
  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 500));
  return [...MOCK_LISTINGS];
}

/**
 * Fetches a single listing by ID.
 * TODO: Replace with:
 *   const doc = await firestore().collection('listings').doc(id).get();
 *   return doc.exists ? { id: doc.id, ...doc.data() } : null;
 *
 * @param {string} id - The listing document ID
 * @returns {Promise<Object|null>} Listing object or null
 */
export async function fetchListingById(id) {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return MOCK_LISTINGS.find((l) => l.id === id) ?? null;
}

/**
 * Fetches listings filtered by sector.
 * TODO: Replace with:
 *   const snapshot = await firestore().collection('listings').where('sector', '==', sector).get();
 *
 * @param {string} sector - The sector to filter by
 * @returns {Promise<Array>} Filtered array of listing objects
 */
export async function fetchListingsBySector(sector) {
  await new Promise((resolve) => setTimeout(resolve, 400));
  return MOCK_LISTINGS.filter(
    (l) => l.sector.toLowerCase() === sector.toLowerCase()
  );
}

/**
 * Creates a new listing.
 * Currently pushes to MOCK_LISTINGS for local persistence.
 *
 * @param {Object} listingData - The new listing data
 * @returns {Promise<Object>} The created listing object
 */
export async function createListing(listingData) {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const newListing = {
    id: `listing_00${MOCK_LISTINGS.length + 1}`,
    ...listingData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    trendingCount: 0,
    raisedAmount: 0,
    status: 'active',
  };
  MOCK_LISTINGS.unshift(newListing); // Insert at the beginning
  return newListing;
}

/**
 * Updates an existing listing.
 *
 * @param {string} id - The listing document ID
 * @param {Object} updates - The data to update
 * @returns {Promise<Object>} The updated listing object
 */
export async function updateListing(id, updates) {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const index = MOCK_LISTINGS.findIndex((l) => l.id === id);
  if (index === -1) throw new Error('Listing not found');
  
  MOCK_LISTINGS[index] = {
    ...MOCK_LISTINGS[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  return MOCK_LISTINGS[index];
}

/**
 * Deletes a listing.
 *
 * @param {string} id - The listing document ID
 * @returns {Promise<void>}
 */
export async function deleteListing(id) {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const index = MOCK_LISTINGS.findIndex((l) => l.id === id);
  if (index > -1) {
    MOCK_LISTINGS.splice(index, 1);
  }
}
