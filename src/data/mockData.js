export const demoUsers = [
  {
    id: 'u1',
    email: 'farmer@fairfarm.pk',
    password: 'password123',
    name: 'Ahmed Khan',
    role: 'Farmer',
    district: 'Faisalabad',
    verificationStatus: 'VERIFIED',
    cnic: '35202-1234567-1',
    phone: '0300-1234567',
    avatar: '👨‍🌾'
  },
  {
    id: 'u2',
    email: 'officer@fairfarm.pk',
    password: 'password123',
    name: 'Tariq Mahmood',
    role: 'Market Officer',
    district: 'Faisalabad Market Board',
    verificationStatus: 'VERIFIED',
    cnic: '35201-5554321-9',
    phone: '0321-9988776',
    avatar: '🛡️'
  },
  {
    id: 'u3',
    email: 'rashid@fairfarm.pk',
    password: 'password123',
    name: 'Mohammad Rashid',
    role: 'Farmer',
    district: 'Multan',
    verificationStatus: 'PENDING_VERIFICATION',
    cnic: '35201-9876543-5',
    phone: '0301-9876543',
    avatar: '🌾'
  }
]

export const pendingFarmersData = [
  {
    id: 'f_101',
    name: 'Mohammad Rashid',
    email: 'rashid@fairfarm.pk',
    phone: '0301-9876543',
    cnic: '35201-9876543-5',
    district: 'Multan',
    landRecordNo: 'FARD-2026-8891',
    submittedDate: '2026-10-04',
    status: 'PENDING_VERIFICATION'
  },
  {
    id: 'f_102',
    name: 'Sultan Ali',
    email: 'sultan@fairfarm.pk',
    phone: '0303-1122334',
    cnic: '35203-1122334-7',
    district: 'Gujranwala',
    landRecordNo: 'FARD-2026-9902',
    submittedDate: '2026-10-05',
    status: 'PENDING_VERIFICATION'
  },
  {
    id: 'f_103',
    name: 'Ghulam Nabi',
    email: 'ghulam@fairfarm.pk',
    phone: '0305-6677889',
    cnic: '35204-6677889-3',
    district: 'Sahiwal',
    landRecordNo: 'FARD-2026-7734',
    submittedDate: '2026-10-03',
    status: 'PENDING_VERIFICATION'
  }
]

export const maskCNIC = (cnic) => {
  if (!cnic) return ''
  const parts = cnic.split('-')
  if (parts.length === 3) {
    return `${parts[0]}-*******-${parts[2]}`
  }
  return cnic.slice(0, 5) + '*******' + cnic.slice(-2)
}

export const maskPhone = (phone) => {
  if (!phone) return ''
  const parts = phone.split('-')
  if (parts.length === 2) {
    return `${parts[0]}-***-${parts[1].slice(-4)}`
  }
  return phone.slice(0, 4) + '***' + phone.slice(-4)
}

export const cropListings = [
  {
    id: 1,
    crop: 'Wheat',
    variety: 'Faisalabad-2008',
    quantity: 500,
    unit: 'KG',
    quality: 'Premium',
    district: 'Faisalabad',
    province: 'Punjab',
    minPrice: 9000,
    referencePrice: 9200,
    priceUnit: '40kg',
    biddingStatus: 'OPEN',
    totalBids: 4,
    endTime: Date.now() + 2 * 60 * 60 * 1000 + 18 * 60 * 1000,
    listedDate: '2026-09-28',
    farmerName: 'Ahmed K.',
    image: '🌾',
  },
  {
    id: 2,
    crop: 'Rice',
    variety: 'Basmati Super',
    quantity: 1200,
    unit: 'KG',
    quality: 'Premium',
    district: 'Gujranwala',
    province: 'Punjab',
    minPrice: 11000,
    referencePrice: 11500,
    priceUnit: '40kg',
    biddingStatus: 'OPEN',
    totalBids: 7,
    endTime: Date.now() + 5 * 60 * 60 * 1000 + 42 * 60 * 1000,
    listedDate: '2026-09-27',
    farmerName: 'Ahmed K.',
    image: '🍚',
  },
  {
    id: 3,
    crop: 'Cotton',
    variety: 'BT-886',
    quantity: 800,
    unit: 'KG',
    quality: 'Grade A',
    district: 'Multan',
    province: 'Punjab',
    minPrice: 18000,
    referencePrice: 18400,
    priceUnit: '40kg',
    biddingStatus: 'OPEN',
    totalBids: 3,
    endTime: Date.now() + 1 * 60 * 60 * 1000 + 5 * 60 * 1000,
    listedDate: '2026-09-29',
    farmerName: 'Ahmed K.',
    image: '🏵️',
  },
  {
    id: 4,
    crop: 'Maize',
    variety: 'Hybrid-3335',
    quantity: 2000,
    unit: 'KG',
    quality: 'Standard',
    district: 'Sahiwal',
    province: 'Punjab',
    minPrice: 4500,
    referencePrice: 4800,
    priceUnit: '40kg',
    biddingStatus: 'ENDED',
    totalBids: 5,
    endTime: Date.now() - 3600000,
    listedDate: '2026-09-25',
    farmerName: 'Ahmed K.',
    image: '🌽',
  },
  {
    id: 5,
    crop: 'Sugarcane',
    variety: 'CP-77/400',
    quantity: 5000,
    unit: 'KG',
    quality: 'Premium',
    district: 'Rahim Yar Khan',
    province: 'Punjab',
    minPrice: 350,
    referencePrice: 380,
    priceUnit: '40kg',
    biddingStatus: 'SOLD',
    totalBids: 9,
    endTime: Date.now() - 86400000,
    listedDate: '2026-09-20',
    farmerName: 'Ahmed K.',
    image: '🎋',
  },
  {
    id: 6,
    crop: 'Tomatoes',
    variety: 'Roma',
    quantity: 300,
    unit: 'KG',
    quality: 'Grade A',
    district: 'Swat',
    province: 'KPK',
    minPrice: 2800,
    referencePrice: 3100,
    priceUnit: '40kg',
    biddingStatus: 'OPEN',
    totalBids: 2,
    endTime: Date.now() + 8 * 60 * 60 * 1000,
    listedDate: '2026-09-30',
    farmerName: 'Ahmed K.',
    image: '🍅',
  },
  {
    id: 7,
    crop: 'Potatoes',
    variety: 'Desiree',
    quantity: 1500,
    unit: 'KG',
    quality: 'Standard',
    district: 'Okara',
    province: 'Punjab',
    minPrice: 1800,
    referencePrice: 2000,
    priceUnit: '40kg',
    biddingStatus: 'OPEN',
    totalBids: 6,
    endTime: Date.now() + 3 * 60 * 60 * 1000 + 30 * 60 * 1000,
    listedDate: '2026-09-29',
    farmerName: 'Ahmed K.',
    image: '🥔',
  },
]

export const marketActivity = [
  { crop: 'Wheat', price: 9200, unit: '40kg', change: +1.2, icon: '🌾' },
  { crop: 'Rice', price: 11500, unit: '40kg', change: +0.8, icon: '🍚' },
  { crop: 'Cotton', price: 18400, unit: '40kg', change: -0.5, icon: '🏵️' },
  { crop: 'Maize', price: 4800, unit: '40kg', change: +2.1, icon: '🌽' },
  { crop: 'Sugarcane', price: 380, unit: '40kg', change: +0.3, icon: '🎋' },
]

export const priceHistoryData = {
  Wheat: [
    { month: 'Apr', price: 8400 },
    { month: 'May', price: 8700 },
    { month: 'Jun', price: 8900 },
    { month: 'Jul', price: 9100 },
    { month: 'Aug', price: 9050 },
    { month: 'Sep', price: 9200 },
  ],
  Rice: [
    { month: 'Apr', price: 10200 },
    { month: 'May', price: 10600 },
    { month: 'Jun', price: 10900 },
    { month: 'Jul', price: 11200 },
    { month: 'Aug', price: 11400 },
    { month: 'Sep', price: 11500 },
  ],
  Cotton: [
    { month: 'Apr', price: 16800 },
    { month: 'May', price: 17200 },
    { month: 'Jun', price: 17600 },
    { month: 'Jul', price: 18000 },
    { month: 'Aug', price: 18200 },
    { month: 'Sep', price: 18400 },
  ],
}

export const districts = [
  'Faisalabad', 'Lahore', 'Multan', 'Gujranwala', 'Sahiwal',
  'Rahim Yar Khan', 'Bahawalpur', 'Okara', 'Swat', 'Peshawar',
  'Hyderabad', 'Sukkur', 'Quetta',
]

export const qualityOptions = ['Premium', 'Grade A', 'Standard', 'Grade B']

export const cropTypes = ['Wheat', 'Rice', 'Cotton', 'Maize', 'Sugarcane', 'Tomatoes', 'Potatoes', 'Onions', 'Mangoes', 'Oranges']

export const cropEmojis = {
  Wheat: '🌾',
  Rice: '🍚',
  Cotton: '🏵️',
  Maize: '🌽',
  Sugarcane: '🎋',
  Tomatoes: '🍅',
  Potatoes: '🥔',
  Onions: '🧅',
  Mangoes: '🥭',
  Oranges: '🍊',
}

export const farmerStats = {
  totalListings: 7,
  activeListings: 5,
  totalBids: 36,
  totalSold: 1,
  totalRevenue: 190000,
}
