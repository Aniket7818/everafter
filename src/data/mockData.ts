import type {
  WeddingWorkspace,
  WeddingEvent,
  Task,
  Expense,
  BudgetCategory,
  Guest,
  Table,
  Vendor,
  Venue,
  VendorInquiry,
  ShortlistItem,
  MoodboardCollection,
  MoodboardItem,
  Invitation,
  WeddingWebsiteConfig,
  CollaborationActivity,
  Notification,
  UserPreferences
} from '@/types'

export const defaultPreferences: UserPreferences = {
  theme: 'light',
  currency: 'INR',
  dateFormat: 'DD/MM/YYYY',
  notifyOnTasks: true,
  notifyOnPayments: true,
  notifyOnRsvp: true
}

export const defaultWorkspace: WeddingWorkspace = {
  id: 'workspace-everafter-demo',
  createdAt: '2026-01-15T10:00:00.000Z',
  updatedAt: '2026-03-25T14:30:00.000Z',
  couple: {
    partner1Name: 'Aanya Sharma',
    partner2Name: 'Rohan Kapoor',
    partner1Title: 'Bride',
    partner2Title: 'Groom',
    weddingTitle: 'The Celebrations of Aanya & Rohan',
    email: 'aanya.rohan@everafterdemo.com',
    phone: '+91 98765 43210',
    story: 'From meeting on a rainy monsoon evening at a quaint cafe in Bandra to countless travel adventures across the globe, we are overjoyed to embark on the biggest celebration of our lives surrounded by everyone we love.'
  },
  weddingDate: '2026-11-28',
  isDateDecided: true,
  location: {
    city: 'Udaipur',
    state: 'Rajasthan',
    country: 'India'
  },
  budget: {
    total: 6500000, // ₹65,00,000 (~$78,000 USD)
    currency: 'INR'
  },
  estimatedGuests: {
    total: 320,
    partner1Count: 160,
    partner2Count: 160
  },
  celebrationStyle: 'Royal Rajputana'
}

export const defaultEvents: WeddingEvent[] = [
  {
    id: 'evt-1',
    name: 'Phoolon Ki Holi & Haldi',
    date: '2026-11-26',
    startTime: '10:30',
    endTime: '14:00',
    venue: 'Courtyard of Marigolds, The Oberoi Udaivilas',
    description: 'A vibrant morning of organic yellow haldi, fresh rose petals, dhol beats, and artisanal chaat delicacies.',
    dressCode: 'Sunshine Yellows & Ochre Sarees / Kurtas',
    assignedVendorIds: ['v-1', 'v-3', 'v-5'],
    assignedTaskIds: ['t-3', 't-8'],
    notes: 'Keep 10 baskets of fresh yellow and orange marigold petals near the central fountain.',
    order: 1
  },
  {
    id: 'evt-2',
    name: 'Sunset Mehendi & Bazaar Soirée',
    date: '2026-11-26',
    startTime: '16:30',
    endTime: '21:00',
    venue: 'Lakeside Promontory & Gardens',
    description: 'Henna artistry under Moroccan canopies with Rajasthani folk musicians, bangle makers, and sunset mocktails.',
    dressCode: 'Pastel Florals, Mint & Rose Lehengas',
    assignedVendorIds: ['v-4', 'v-6'],
    assignedTaskIds: ['t-9'],
    notes: 'Provide footrests and hand rests for the bridal party during intricate henna application.',
    order: 2
  },
  {
    id: 'evt-3',
    name: 'The Royal Sangeet & Musical Night',
    date: '2026-11-27',
    startTime: '19:00',
    endTime: '01:30',
    venue: 'Grand Chhatri Ballroom & Pool Deck',
    description: 'High-octane family dance face-offs, LED stage performances, gourmet dinner stations, and DJ midnight set.',
    dressCode: 'Mirror Work, Glamorous Sequins, Tuxedos & Bandhgalas',
    assignedVendorIds: ['v-1', 'v-2', 'v-7'],
    assignedTaskIds: ['t-10'],
    notes: 'Rehearsal soundcheck scheduled for 3:00 PM on same day.',
    order: 3
  },
  {
    id: 'evt-4',
    name: 'Vedic Wedding Ceremony (Pheras)',
    date: '2026-11-28',
    startTime: '16:00',
    endTime: '20:30',
    venue: 'Lakeside Glass Mandap over Lake Pichola',
    description: 'Traditional Vedic pheras against the golden hour sunset, accompanied by classical shehnai and live sitar ensemble.',
    dressCode: 'Traditional Regal Red, Deep Rust, or Ivory with Gold embroidery',
    assignedVendorIds: ['v-1', 'v-2', 'v-3'],
    assignedTaskIds: ['t-1', 't-2', 't-4'],
    notes: 'Mandap sacred fire requires fragrant sandalwood chips and rose water sprinkling.',
    order: 4
  },
  {
    id: 'evt-5',
    name: 'Grand Imperial Reception & Gala Dinner',
    date: '2026-11-29',
    startTime: '19:30',
    endTime: '02:00',
    venue: 'The Palace Banquet Pavilion & Lawns',
    description: 'A black-tie and royal banquet celebrating the newlyweds with live symphony orchestra, champagne toasts, and multi-course feast.',
    dressCode: 'Cocktail Glamour, Velvet Sherwanis & Evening Gowns',
    assignedVendorIds: ['v-1', 'v-2', 'v-8'],
    assignedTaskIds: ['t-5'],
    notes: 'Grand entrance for couple at 8:30 PM followed by cake cutting.',
    order: 5
  }
]

export const defaultBudgetCategories: BudgetCategory[] = [
  { id: 'cat-venue', name: 'Venue & Palace Lawns', allocatedAmount: 1950000, color: '#B99A62' },
  { id: 'cat-catering', name: 'Royal Banquet & Catering', allocatedAmount: 1560000, color: '#D8C29D' },
  { id: 'cat-decor', name: 'Floral Art & Mandap Decor', allocatedAmount: 980000, color: '#AAB5A0' },
  { id: 'cat-photo', name: 'Cinematography & Photography', allocatedAmount: 520000, color: '#D9B8B0' },
  { id: 'cat-attire', name: 'Couture & Outfits', allocatedAmount: 450000, color: '#BD968D' },
  { id: 'cat-jewellery', name: 'Jewellery & Heirlooms', allocatedAmount: 260000, color: '#937740' },
  { id: 'cat-entertainment', name: 'Live Artists, Sangeet & DJ', allocatedAmount: 260000, color: '#58524D' },
  { id: 'cat-makeup', name: 'Bridal & Groom Makeup', allocatedAmount: 195000, color: '#EAD7D2' },
  { id: 'cat-invites', name: 'Bespoke Stationery & Invites', allocatedAmount: 130000, color: '#C7D1BF' },
  { id: 'cat-hospitality', name: 'Guest Hospitality & Transfers', allocatedAmount: 195000, color: '#3C3936' }
]

export const defaultExpenses: Expense[] = [
  {
    id: 'exp-1',
    title: 'Udaivilas Lakefront Venue Advance',
    categoryId: 'cat-venue',
    vendorId: 'v-venue-1',
    eventId: 'evt-4',
    estimatedAmount: 1950000,
    actualAmount: 1900000,
    paidAmount: 1000000,
    paymentStatus: 'partially_paid',
    expenseDate: '2026-02-10',
    dueDate: '2026-10-15',
    notes: '50% advance deposited upon contract signing.',
    receiptName: 'Udaivilas_Advance_Deposit_Receipt.pdf'
  },
  {
    id: 'exp-2',
    title: 'Gourmet Catering Tasting & Retainer',
    categoryId: 'cat-catering',
    vendorId: 'v-2',
    eventId: 'evt-5',
    estimatedAmount: 1560000,
    actualAmount: 1520000,
    paidAmount: 600000,
    paymentStatus: 'partially_paid',
    expenseDate: '2026-02-20',
    dueDate: '2026-11-01',
    notes: 'Includes bespoke live dessert counters and molecular mixology bar.'
  },
  {
    id: 'exp-3',
    title: 'Lakeside Mandap & Floral Decor Retainer',
    categoryId: 'cat-decor',
    vendorId: 'v-3',
    eventId: 'evt-4',
    estimatedAmount: 980000,
    actualAmount: 950000,
    paidAmount: 400000,
    paymentStatus: 'partially_paid',
    expenseDate: '2026-03-01',
    dueDate: '2026-11-10',
    notes: 'Imported Dutch tuberoses, white peonies, and hanging brass urlis.'
  },
  {
    id: 'exp-4',
    title: 'Artisan Photography 4-Day Film Package',
    categoryId: 'cat-photo',
    vendorId: 'v-1',
    estimatedAmount: 520000,
    actualAmount: 500000,
    paidAmount: 500000,
    paymentStatus: 'paid',
    expenseDate: '2026-02-15',
    dueDate: '2026-02-15',
    notes: 'Paid in full for priority drone licensing and 35mm candid film roll additions.'
  },
  {
    id: 'exp-5',
    title: 'Sabyasachi Heritage Lehenga Token',
    categoryId: 'cat-attire',
    estimatedAmount: 320000,
    actualAmount: 340000,
    paidAmount: 340000,
    paymentStatus: 'paid',
    expenseDate: '2026-02-28',
    notes: 'Zardozi hand-embroidered velvet lehenga fitting confirmed.'
  },
  {
    id: 'exp-6',
    title: 'DJ & Sound System Setup Booking',
    categoryId: 'cat-entertainment',
    vendorId: 'v-7',
    eventId: 'evt-3',
    estimatedAmount: 260000,
    actualAmount: 240000,
    paidAmount: 100000,
    paymentStatus: 'partially_paid',
    expenseDate: '2026-03-12',
    dueDate: '2026-11-20',
    notes: 'Concert grade line-array sound and intelligent haze lighting.'
  },
  {
    id: 'exp-7',
    title: 'Handcrafted Wax-Seal Box Invitations',
    categoryId: 'cat-invites',
    estimatedAmount: 130000,
    actualAmount: 125000,
    paidAmount: 125000,
    paymentStatus: 'paid',
    expenseDate: '2026-03-18',
    notes: '300 gold-foil etched box invites delivered.'
  },
  {
    id: 'exp-8',
    title: 'Bridal Hair & Makeup Artist Booking Fee',
    categoryId: 'cat-makeup',
    vendorId: 'v-5',
    estimatedAmount: 195000,
    actualAmount: 190000,
    paidAmount: 90000,
    paymentStatus: 'partially_paid',
    expenseDate: '2026-03-22',
    dueDate: '2026-11-15'
  }
]

export const defaultTasks: Task[] = [
  {
    id: 't-1',
    title: 'Finalize and sign royal palace venue contract',
    description: 'Review guest curfew rules, liquor licensing permits, and lawn setup timings with the hotel manager.',
    completed: true,
    dueDate: '2026-02-15',
    priority: 'High',
    category: 'Venue',
    assignedTo: 'Rohan Kapoor',
    subtasks: [
      { id: 'st-1', title: 'Review sound restriction policy after 10 PM', completed: true },
      { id: 'st-2', title: 'Verify guest room block inventory (70 rooms reserved)', completed: true },
      { id: 'st-3', title: 'Submit signed advance payment voucher', completed: true }
    ],
    notes: 'Contract signed with Oberoi Udaivilas sales team.',
    createdAt: '2026-01-20'
  },
  {
    id: 't-2',
    title: 'Select and book lead wedding photographer',
    description: 'Ensure deliverables include high-res drone footage, teasers in 48 hours, and 35mm film memories.',
    completed: true,
    dueDate: '2026-02-25',
    priority: 'High',
    category: 'Photography',
    assignedTo: 'Aanya Sharma',
    subtasks: [
      { id: 'st-4', title: 'Portfolio review of top 3 shortlists', completed: true },
      { id: 'st-5', title: 'Schedule Zoom interview with lead shooter', completed: true },
      { id: 'st-6', title: 'Confirm arrival 1 day prior for location scouting', completed: true }
    ],
    createdAt: '2026-01-22'
  },
  {
    id: 't-3',
    title: 'Order organic petals & gulal for Haldi celebration',
    description: 'Procure 50kg of fresh organic yellow and orange marigold petals, plus eco-friendly herbal gulal.',
    completed: false,
    dueDate: '2026-10-10',
    priority: 'Medium',
    category: 'Decor',
    assignedTo: 'Family Member (Pooja Auntie)',
    subtasks: [
      { id: 'st-7', title: 'Source local Udaipur flower market suppliers', completed: false },
      { id: 'st-8', title: 'Arrange brass urli bowls for petals display', completed: false }
    ],
    createdAt: '2026-03-01'
  },
  {
    id: 't-4',
    title: 'Schedule final bridal lehenga and groom sherwani fitting',
    description: 'Book atelier appointments in Delhi for final seam alterations and dupatta draping trials.',
    completed: false,
    dueDate: '2026-10-25',
    priority: 'High',
    category: 'Attire',
    assignedTo: 'Aanya Sharma',
    subtasks: [
      { id: 'st-9', title: 'Carry wedding heels to fitting', completed: false },
      { id: 'st-10', title: 'Test safa (turban) fabric match for groom', completed: false }
    ],
    createdAt: '2026-03-05'
  },
  {
    id: 't-5',
    title: 'Confirm airport luxury bus and vintage car transfers',
    description: 'Schedule welcoming fleet at Maharana Pratap Airport (UDR) for out-of-town guests arriving on Nov 25 & 26.',
    completed: false,
    dueDate: '2026-10-15',
    priority: 'Medium',
    category: 'Hospitality',
    assignedTo: 'Planner (Devika)',
    subtasks: [
      { id: 'st-11', title: 'Collect guest flight arrival schedules via RSVP sheet', completed: true },
      { id: 'st-12', title: 'Book 1938 vintage convertible for royal baraat entry', completed: false }
    ],
    createdAt: '2026-03-10'
  },
  {
    id: 't-6',
    title: 'Approve digital invitation cards and send VIP RSVP links',
    description: 'Ensure RSVP unique codes are embedded and WhatsApp template is ready.',
    completed: true,
    dueDate: '2026-03-20',
    priority: 'High',
    category: 'Invitations',
    assignedTo: 'Aanya & Rohan',
    subtasks: [
      { id: 'st-13', title: 'Proofread event dates and hotel address', completed: true },
      { id: 'st-14', title: 'Send first batch of 150 invites to immediate family', completed: true }
    ],
    createdAt: '2026-03-10'
  },
  {
    id: 't-7',
    title: 'Finalize multi-cuisine banquet menu with executive chef',
    description: 'Includes Rajasthani Thali for lunch, Pan-Asian dim sum counter for Sangeet, and live truffle risotto bar for Reception.',
    completed: false,
    dueDate: '2026-10-18',
    priority: 'High',
    category: 'Catering',
    assignedTo: 'Rohan Kapoor',
    subtasks: [
      { id: 'st-15', title: 'Provide Jain and Vegan dietary options list', completed: false },
      { id: 'st-16', title: 'Select 4 signature welcome mocktails', completed: true }
    ],
    createdAt: '2026-03-15'
  },
  {
    id: 't-8',
    title: 'Coordinate Sangeet choreography sessions',
    description: 'Plan 6 weekend Zoom rehearsals for cousins and bridal entourage.',
    completed: false,
    dueDate: '2026-10-30',
    priority: 'Medium',
    category: 'Entertainment',
    assignedTo: 'Partner B (Rohan)',
    subtasks: [
      { id: 'st-17', title: 'Cut 8-song Bollywood mix track (total 12 mins)', completed: true },
      { id: 'st-18', title: 'Couple dance duet rehearsal schedule', completed: false }
    ],
    createdAt: '2026-03-18'
  }
]

export const defaultGuests: Guest[] = [
  {
    id: 'g-1',
    code: 'EA-9001',
    fullName: 'Sunita & Ramesh Sharma',
    email: 'ramesh.sharma@example.com',
    phone: '+91 98201 12345',
    side: 'Partner A',
    group: 'Bride Immediate Family',
    accompanyingGuests: 1,
    invitedEventIds: ['evt-1', 'evt-2', 'evt-3', 'evt-4', 'evt-5'],
    rsvpStatus: 'Accepted',
    mealPreference: 'Vegetarian',
    dietaryRequirements: 'Mild spice, strictly vegetarian',
    tableId: 'tbl-1',
    seatNumber: 1,
    internalNotes: 'Parents of the bride. Assign front row mandap seating.'
  },
  {
    id: 'g-2',
    code: 'EA-9002',
    fullName: 'Vikram & Anjali Kapoor',
    email: 'vikram.k@example.com',
    phone: '+91 98110 56789',
    side: 'Partner B',
    group: 'Groom Immediate Family',
    accompanyingGuests: 1,
    invitedEventIds: ['evt-1', 'evt-2', 'evt-3', 'evt-4', 'evt-5'],
    rsvpStatus: 'Accepted',
    mealPreference: 'Non-Vegetarian',
    tableId: 'tbl-1',
    seatNumber: 3,
    internalNotes: 'Parents of the groom.'
  },
  {
    id: 'g-3',
    code: 'EA-9003',
    fullName: 'Priya & Kabir Singhania',
    email: 'priya.singh@example.com',
    phone: '+91 99300 23412',
    side: 'Both',
    group: 'College Friends',
    accompanyingGuests: 1,
    invitedEventIds: ['evt-2', 'evt-3', 'evt-4', 'evt-5'],
    rsvpStatus: 'Accepted',
    mealPreference: 'Vegetarian',
    tableId: 'tbl-2',
    seatNumber: 1
  },
  {
    id: 'g-4',
    code: 'EA-9004',
    fullName: 'Arjun Mehta',
    email: 'arjun.mehta@example.com',
    phone: '+91 98450 78901',
    side: 'Partner B',
    group: 'Work Colleagues',
    accompanyingGuests: 0,
    invitedEventIds: ['evt-3', 'evt-4', 'evt-5'],
    rsvpStatus: 'Accepted',
    mealPreference: 'Vegan',
    dietaryRequirements: 'Lactose intolerant, no dairy',
    tableId: 'tbl-3',
    seatNumber: 1
  },
  {
    id: 'g-5',
    code: 'EA-9005',
    fullName: 'Dr. Harshvardhan Joshi',
    email: 'dr.joshi@example.com',
    phone: '+91 94140 11223',
    side: 'Partner A',
    group: 'Relatives',
    accompanyingGuests: 1,
    invitedEventIds: ['evt-1', 'evt-4', 'evt-5'],
    rsvpStatus: 'Pending',
    mealPreference: 'Jain',
    dietaryRequirements: 'Strictly Jain (no root vegetables, onions, or garlic)',
    internalNotes: 'Elder uncle. Requires ground floor room with elevator access.'
  },
  {
    id: 'g-6',
    code: 'EA-9006',
    fullName: 'Natasha Verma & Daniel Craig',
    email: 'natasha.v@example.com',
    side: 'Partner A',
    group: 'Childhood Besties',
    accompanyingGuests: 1,
    invitedEventIds: ['evt-1', 'evt-2', 'evt-3', 'evt-4', 'evt-5'],
    rsvpStatus: 'Accepted',
    mealPreference: 'Non-Vegetarian',
    tableId: 'tbl-2',
    seatNumber: 3,
    internalNotes: 'Maid of honor. Flying from London.'
  },
  {
    id: 'g-7',
    code: 'EA-9007',
    fullName: 'Sameer & Tanvi Bhargava',
    email: 'sameer.b@example.com',
    side: 'Partner B',
    group: 'Groom Cousins',
    accompanyingGuests: 2,
    invitedEventIds: ['evt-1', 'evt-2', 'evt-3', 'evt-4', 'evt-5'],
    rsvpStatus: 'Accepted',
    mealPreference: 'Vegetarian',
    tableId: 'tbl-4',
    seatNumber: 1
  },
  {
    id: 'g-8',
    code: 'EA-9008',
    fullName: 'Kavita Chawla',
    email: 'kavita.c@example.com',
    side: 'Both',
    group: 'Family Friends',
    accompanyingGuests: 0,
    invitedEventIds: ['evt-4', 'evt-5'],
    rsvpStatus: 'Declined',
    mealPreference: 'Vegetarian',
    internalNotes: 'Regretfully unable to travel due to exam schedule.'
  },
  {
    id: 'g-9',
    code: 'EA-9009',
    fullName: 'Rohit & Shweta Malhotra',
    email: 'rohit.m@example.com',
    side: 'Partner B',
    group: 'College Friends',
    accompanyingGuests: 1,
    invitedEventIds: ['evt-2', 'evt-3', 'evt-4', 'evt-5'],
    rsvpStatus: 'Pending',
    mealPreference: 'Non-Vegetarian'
  },
  {
    id: 'g-10',
    code: 'EA-9010',
    fullName: 'Meera Deshmukh',
    email: 'meera.d@example.com',
    side: 'Partner A',
    group: 'Work Colleagues',
    accompanyingGuests: 0,
    invitedEventIds: ['evt-3', 'evt-4', 'evt-5'],
    rsvpStatus: 'Accepted',
    mealPreference: 'Vegetarian',
    tableId: 'tbl-3',
    seatNumber: 2
  }
]

export const defaultTables: Table[] = [
  {
    id: 'tbl-1',
    name: 'Table 1: The Royal Family Pavilion',
    shape: 'Rectangle',
    capacity: 10,
    eventId: 'evt-5',
    x: 120,
    y: 100
  },
  {
    id: 'tbl-2',
    name: 'Table 2: Bridal Entourage & Besties',
    shape: 'Round',
    capacity: 8,
    eventId: 'evt-5',
    x: 420,
    y: 100
  },
  {
    id: 'tbl-3',
    name: 'Table 3: Tech Colleagues & Leaders',
    shape: 'Round',
    capacity: 8,
    eventId: 'evt-5',
    x: 120,
    y: 380
  },
  {
    id: 'tbl-4',
    name: 'Table 4: Cousins & Sangeet Squad',
    shape: 'Square',
    capacity: 8,
    eventId: 'evt-5',
    x: 420,
    y: 380
  }
]

export const defaultVenues: Venue[] = [
  {
    id: 'v-venue-1',
    name: 'The Oberoi Udaivilas',
    city: 'Udaipur',
    state: 'Rajasthan',
    venueType: 'Palace',
    capacity: 450,
    startingPrice: 1800000,
    currency: 'INR',
    indoorOutdoor: 'Both',
    amenities: ['Lakeside Promontory', 'Historic Architecture', 'Helipad', 'Private Pool Suites', 'Valet Parking', 'Bridal Villa', 'Sound Limit 11 PM'],
    coverImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Set on the idyllic banks of Lake Pichola, The Oberoi Udaivilas stands as a masterpiece of Mewari arches, golden reflection pools, and sprawling royal gardens.',
    rating: 4.95,
    reviewCount: 84,
    address: 'Badi-Gorela-Mulla Talai Rd, Haridas Ji Ki Magri, Udaipur, Rajasthan 313001',
    contactEmail: 'weddings@oberoiudaivilas-demo.com',
    contactPhone: '+91 294 243 3300',
    isFeatured: true
  },
  {
    id: 'v-venue-2',
    name: 'Fairmont Jaipur Heritage Palace',
    city: 'Jaipur',
    state: 'Rajasthan',
    venueType: 'Resort',
    capacity: 800,
    startingPrice: 2200000,
    currency: 'INR',
    indoorOutdoor: 'Both',
    amenities: ['Grand Ballroom', 'Elephant Procession Courtyard', 'Spa Pavilion', 'Luxury Guest Suites', 'Late Night Banqueting', 'Multi-Kitchen Facilities'],
    coverImage: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Nestled amidst the rugged Aravalli hills, Fairmont Jaipur pays homage to Mughal emperors and Rajput kings with palatial elegance and theatrical wedding setups.',
    rating: 4.9,
    reviewCount: 112,
    address: '2, RIICO Kukas, Jaipur, Rajasthan 302028',
    contactEmail: 'celebrations@fairmontjaipur-demo.com',
    contactPhone: '+91 1426 420 000',
    isFeatured: true
  },
  {
    id: 'v-venue-3',
    name: 'Alila Fort Bishangarh',
    city: 'Bishangarh',
    state: 'Rajasthan',
    venueType: 'Palace',
    capacity: 250,
    startingPrice: 1500000,
    currency: 'INR',
    indoorOutdoor: 'Both',
    amenities: ['230-Year-Old Historic Fort', 'Rooftop Stargazing Lounge', 'Private Helipad', 'Heritage Dungeons Library', 'Artisanal Organic Cuisine'],
    coverImage: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'An intimate, fortress-perched royal experience blending war-fort grandeur with luxurious contemporary suites for close-knit destination weddings.',
    rating: 4.88,
    reviewCount: 46,
    address: 'Off NH-8, Manoharpur, Bishangarh, Rajasthan 303103',
    contactEmail: 'events@alilafort-demo.com',
    contactPhone: '+91 1422 284 500'
  },
  {
    id: 'v-venue-4',
    name: 'The Leela Palace Seaside',
    city: 'Goa',
    state: 'Goa',
    venueType: 'Destination Venue',
    capacity: 600,
    startingPrice: 1600000,
    currency: 'INR',
    indoorOutdoor: 'Both',
    amenities: ['Private Beachfront Access', 'Lagoon Waterfalls', 'Golf Course', 'Sunset Beach Mandap', 'Open-Air Lawn'],
    coverImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Sun-drenched coastal glamour where Portuguese heritage architecture meets tropical gardens for breezy beachside vows and glamorous reception galas.',
    rating: 4.85,
    reviewCount: 92,
    address: 'Mobor Beach, Cavelossim, Goa 403731',
    contactEmail: 'beachweddings@theleela-demo.com',
    contactPhone: '+91 832 662 1234'
  },
  {
    id: 'v-venue-5',
    name: 'The Glasshouse & Botanical Pavilion',
    city: 'Bangalore',
    state: 'Karnataka',
    venueType: 'Garden',
    capacity: 500,
    startingPrice: 850000,
    currency: 'INR',
    indoorOutdoor: 'Both',
    amenities: ['Climate-controlled Glass Conservatory', 'Heritage Banyan Tree Mandap', 'Bridal Dressing Suite', 'Ample Parking'],
    coverImage: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'European glasshouse romance set within 15 acres of sprawling botanical greenery, ideal for floral daytime mehendis and fairytale twilight ceremonies.',
    rating: 4.82,
    reviewCount: 63,
    address: 'North Bangalore Botanical Enclave, Bangalore 560064',
    contactEmail: 'info@glasshouse-demo.com',
    contactPhone: '+91 80 4123 4567'
  }
]

export const defaultVendors: Vendor[] = [
  {
    id: 'v-1',
    name: 'Stories by Joseph Radhik Studios',
    category: 'Photographer',
    city: 'Mumbai',
    state: 'Maharashtra',
    rating: 4.98,
    reviewCount: 142,
    startingPrice: 450000,
    currency: 'INR',
    shortDescription: 'Celebrity and royal wedding photography capturing raw emotion, timeless fine art portraits, and cinematic moments.',
    longDescription: 'Recognized internationally for pioneering fine-art wedding photojournalism in India. We document your celebration with editorial finesse, capturing moments you felt but never saw.',
    coverImage: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80'
    ],
    availabilityLabel: 'Booking for 2026/27',
    features: ['Lead Master Photographer', '35mm Film Rolls', 'Drone Cinema', 'Same-Day Highlights', 'Handmade Leather Album'],
    packages: [
      { id: 'pkg-1', name: 'Royal 4-Day Complete Story', price: 650000, deliverables: ['4 Days Coverage', '2 Master Shooters + 3 Candid Shooters', 'Cinema Teaser + 30 Min Film', '150-Page Fine Art Album'] },
      { id: 'pkg-2', name: 'Classic Wedding & Sangeet', price: 450000, deliverables: ['2 Days Coverage', '3 Shooters', '3-5 Min Teaser Film', 'Full Online Gallery'] }
    ],
    reviews: [
      { id: 'rev-1', author: 'Dia & Siddharth', rating: 5, date: '2025-12-14', comment: 'Every single frame looked straight out of a Vogue editorial. Joseph’s team was unobtrusive yet captured the deepest tears and biggest laughs!' }
    ],
    contactEmail: 'connect@storiesbyjr-demo.com',
    contactPhone: '+91 98200 45678',
    instagram: '@storiesbyjosephradhik',
    isFeatured: true
  },
  {
    id: 'v-2',
    name: 'Food Inc. by The Yum Yum Tree',
    category: 'Caterer',
    city: 'Delhi',
    state: 'Delhi NCR',
    rating: 4.92,
    reviewCount: 98,
    startingPrice: 3500, // per plate
    currency: 'INR',
    shortDescription: 'Haute gastronomy catering company renowned for theatrical live stations, regional micro-cuisines, and artisanal presentations.',
    longDescription: 'Curating world-class culinary journeys from slow-cooked Awadhi dum biryanis and authentic Royal Mewari feasts to Tokyo-inspired sushi bars and Parisian patisseries.',
    coverImage: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80'
    ],
    availabilityLabel: 'Available for Select Dates',
    features: ['Signature Live Dessert Theatre', 'Molecular Bar Setup', 'Silver & Brass Dinnerware', 'Custom Diet Accommodations'],
    packages: [
      { id: 'pkg-3', name: 'Maharaja Heritage Banquet', price: 4200, deliverables: ['8 Course Interactive Dining', 'Live Woodfired & Clay Oven Counter', 'Dessert Atelier'] }
    ],
    reviews: [
      { id: 'rev-2', author: 'Karan & Natasha', rating: 5, date: '2026-01-20', comment: 'Our guests are still raving about the smoked galouti kebabs and the liquid nitrogen kulfi station!' }
    ],
    contactEmail: 'hospitality@foodinc-demo.com',
    contactPhone: '+91 99100 88221',
    isFeatured: true
  },
  {
    id: 'v-3',
    name: 'Devika Narain & Company',
    category: 'Decorator',
    city: 'Mumbai',
    state: 'Maharashtra',
    rating: 4.96,
    reviewCount: 76,
    startingPrice: 800000,
    currency: 'INR',
    shortDescription: 'Eco-conscious bespoke wedding spatial design celebrating regional heritage, organic botanicals, and Indian craftsmanship.',
    longDescription: 'We design spaces that tell stories. We consciously avoid plastic floristry and disposable foam, using fresh seasonal blooms, hand-woven fabrics, and heirloom brass accents.',
    coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=800&q=80'
    ],
    availabilityLabel: 'Limited Commissions per Season',
    features: ['Custom Mandap Spatial Architecture', 'Sustainably Sourced Florals', 'Bespoke Ambient Lighting', 'Hand-painted Backdrops'],
    packages: [
      { id: 'pkg-4', name: 'Complete 3-Day Design & Execution', price: 1400000, deliverables: ['Mandap, Sangeet & Haldi Art Direction', 'Custom Linen & Table Scapes', 'Structural CAD Renders'] }
    ],
    reviews: [
      { id: 'rev-3', author: 'Anushka & Virat (Demo Review)', rating: 5, date: '2025-11-18', comment: 'Devika turned our Tuscan dream into reality. Pure poetry in florals.' }
    ],
    contactEmail: 'studio@devikanarain-demo.com',
    contactPhone: '+91 98211 99887',
    instagram: '@naraindevika',
    isFeatured: true
  },
  {
    id: 'v-4',
    name: 'Veena Nagda Henna Artistry',
    category: 'Mehendi artist',
    city: 'Mumbai',
    state: 'Maharashtra',
    rating: 4.94,
    reviewCount: 165,
    startingPrice: 45000,
    currency: 'INR',
    shortDescription: 'Bollywood’s legendary henna artist famed for intricate bridal portrait storytelling, dark natural stains, and fast application.',
    longDescription: 'With over three decades decorating royalty and film stars, Veena Nagda and her team craft deep-toned organic herbal henna featuring bridal portraits, vows, and delicate filigree.',
    coverImage: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80'
    ],
    availabilityLabel: 'Booking on Request',
    features: ['Natural 100% Herbal Henna', 'Bridal Caricature & Portrait Work', 'Team of 10 for Guests'],
    packages: [
      { id: 'pkg-5', name: 'Bridal Royal Henna + 25 Guests', price: 85000, deliverables: ['Elbow-length bridal mehendi with portrait', '25 guest palms by senior team'] }
    ],
    reviews: [
      { id: 'rev-4', author: 'Rhea K.', rating: 5, date: '2026-02-04', comment: 'The stain was almost maroon-black and lasted 3 weeks! She finished my full arms in just 3 hours.' }
    ],
    contactEmail: 'veena@veenanagda-demo.com',
    contactPhone: '+91 98201 33445'
  },
  {
    id: 'v-5',
    name: 'Namrata Soni Hair & Makeup',
    category: 'Makeup artist',
    city: 'Mumbai',
    state: 'Maharashtra',
    rating: 4.97,
    reviewCount: 130,
    startingPrice: 150000,
    currency: 'INR',
    shortDescription: 'Sublime, dewy, glowing skin and modern bridal glam customized to your facial architecture and jewelry.',
    longDescription: 'Signature luminous base that withstands emotional ceremony moments, tropical humidity, and 4K cinema lenses with timeless perfection.',
    coverImage: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80'
    ],
    availabilityLabel: 'Available for Travel Worldwide',
    features: ['Airbrush & HD Foundation', 'Luxury Mink Lashes', 'Dupatta & Jewelry Draping', 'Mother of Bride Touchup'],
    packages: [
      { id: 'pkg-6', name: '3 Functions Bridal Suite', price: 320000, deliverables: ['Sangeet, Wedding & Reception Looks', 'Hairstyling, Draping & Lashes Included'] }
    ],
    reviews: [
      { id: 'rev-5', author: 'Tara & Neil', rating: 5, date: '2026-01-10', comment: 'Namrata gave me the glow of a lifetime. I cried during the vidai and not a drop of makeup smudged!' }
    ],
    contactEmail: 'team@namratasoni-demo.com',
    contactPhone: '+91 98202 77665'
  },
  {
    id: 'v-6',
    name: 'DJ Chetas & Live Dhol Collective',
    category: 'DJ and entertainment',
    city: 'Mumbai',
    state: 'Maharashtra',
    rating: 4.91,
    reviewCount: 180,
    startingPrice: 350000,
    currency: 'INR',
    shortDescription: 'India’s #1 Bollywood DJ accompanied by explosive live Punjabi dhol players and stadium-grade lighting visualizers.',
    longDescription: 'Guaranteed non-stop dancefloors from 10 PM until sunrise with custom remixes, high-energy mashups, and interactive crowd engagement.',
    coverImage: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80'
    ],
    availabilityLabel: 'Touring Schedule Available',
    features: ['Custom Mashup Track for Couple', '4 Live Percussionists & Dholis', 'Cold Spark Pyrotechnics Sync'],
    packages: [
      { id: 'pkg-7', name: 'Full Night Sangeet & Afterparty', price: 500000, deliverables: ['6 Hours Live DJ Set', 'Line-Array System Optimization', 'Live Dhol Fusion'] }
    ],
    reviews: [
      { id: 'rev-6', author: 'Akash G.', rating: 5, date: '2025-12-28', comment: 'Nobody left the dancefloor until 4 in the morning. Absolutely legendary energy.' }
    ],
    contactEmail: 'bookings@djchetas-demo.com',
    contactPhone: '+91 98199 11223'
  },
  {
    id: 'v-7',
    name: 'The Wedding Design Company (WDC)',
    category: 'Wedding planner',
    city: 'Delhi',
    state: 'Delhi NCR',
    rating: 4.99,
    reviewCount: 88,
    startingPrice: 900000,
    currency: 'INR',
    shortDescription: 'Full-service luxury event management orchestrating high-profile destination weddings with military precision and royal flair.',
    longDescription: 'Handling everything from chartered aircraft hospitality, VIP guest concierges, multi-million production rigging to intimate family traditions seamlessly.',
    coverImage: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=800&q=80'
    ],
    availabilityLabel: '4 Planners Assigned per Wedding',
    features: ['Guest Hospitality Helpdesk', 'End-to-End Vendor Curation', 'RSVP & Transport Tracking', '24/7 Shadow for Couple'],
    packages: [
      { id: 'pkg-8', name: 'Imperial Turnkey Planning', price: 1500000, deliverables: ['12 Months Pre-Planning', 'On-ground Team of 25 Co-ordinators', 'Budget & Vendor Financial Governance'] }
    ],
    reviews: [
      { id: 'rev-7', author: 'Sonam & Anand (Demo Review)', rating: 5, date: '2025-10-30', comment: 'We did not have to worry about a single detail for 4 days. Flawless hospitality.' }
    ],
    contactEmail: 'concierge@wdcweddings-demo.com',
    contactPhone: '+91 11 4155 9900'
  }
]

export const defaultShortlist: ShortlistItem[] = [
  { id: 'sl-1', itemType: 'vendor', itemId: 'v-1', isPreferred: true, estimatedCost: 500000, isBooked: true, notes: 'Confirmed and deposit paid.', addedAt: '2026-02-01' },
  { id: 'sl-2', itemType: 'vendor', itemId: 'v-2', isPreferred: true, estimatedCost: 1520000, isBooked: true, notes: 'Menu tasting scheduled.', addedAt: '2026-02-05' },
  { id: 'sl-3', itemType: 'vendor', itemId: 'v-3', isPreferred: true, estimatedCost: 950000, isBooked: true, notes: 'Sample mandap 3D render approved.', addedAt: '2026-02-10' },
  { id: 'sl-4', itemType: 'venue', itemId: 'v-venue-1', isPreferred: true, estimatedCost: 1900000, isBooked: true, notes: 'Signed contract on file.', addedAt: '2026-01-25' },
  { id: 'sl-5', itemType: 'venue', itemId: 'v-venue-2', isPreferred: false, estimatedCost: 2200000, isBooked: false, notes: 'Alternative if guest count increases beyond 500.', addedAt: '2026-01-20' }
]

export const defaultInquiries: VendorInquiry[] = [
  {
    id: 'inq-1',
    itemId: 'v-1',
    itemType: 'vendor',
    itemName: 'Stories by Joseph Radhik Studios',
    eventDate: '2026-11-26',
    guestCount: 320,
    estimatedBudget: 550000,
    message: 'Hello Joseph, we love your candid style and want to enquire for our 4-day Udaipur royal celebration.',
    status: 'Booked',
    createdAt: '2026-01-25'
  },
  {
    id: 'inq-2',
    itemId: 'v-3',
    itemType: 'vendor',
    itemName: 'Devika Narain & Company',
    eventDate: '2026-11-28',
    guestCount: 320,
    estimatedBudget: 1000000,
    message: 'Interested in sustainable floral mandap designs over the lake.',
    status: 'Booked',
    createdAt: '2026-02-02'
  }
]

export const defaultMoodboardCollections: MoodboardCollection[] = [
  { id: 'col-1', title: 'Royal Rajputana Palette & Mandap', description: 'Warm ivory, regal gold, marigold yellow, and antique brass details.', coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80', isDefault: true },
  { id: 'col-2', title: 'Sunset Sangeet Glamour', description: 'Deep emerald greens, mirrored chandeliers, and starry illumination.', coverImage: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80' },
  { id: 'col-3', title: 'Editorial Attire & Heirloom Silks', description: 'Hand-woven brocades, polki chokers, and royal turbans.', coverImage: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80' }
]

export const defaultMoodboardItems: MoodboardItem[] = [
  { id: 'm-1', title: 'Floating Water Mandap with Peonies', category: 'Stage design', imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80', tags: ['Mandap', 'Peonies', 'Lakeside'], collectionId: 'col-1', order: 1 },
  { id: 'm-2', title: 'Brass Urlis with Floating Marigold Petals', category: 'Decoration', imageUrl: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=800&q=80', tags: ['Haldi', 'Yellow', 'Traditional'], collectionId: 'col-1', order: 2 },
  { id: 'm-3', title: 'Heritage Velvet Zardozi Bridal Lehenga', category: 'Bridal outfits', imageUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80', tags: ['Couture', 'Deep Red', 'Bridal'], collectionId: 'col-3', order: 3 },
  { id: 'm-4', title: 'Gold Foil Letterpress Wedding Suite', category: 'Invitations', imageUrl: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=800&q=80', tags: ['Stationery', 'Gold Foil', 'Letterpress'], collectionId: 'col-1', order: 4 },
  { id: 'm-5', title: 'Candlelit Mirror Work Table Settings', category: 'Table settings', imageUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80', tags: ['Dinner', 'Candles', 'Elegance'], collectionId: 'col-2', order: 5 },
  { id: 'm-6', title: 'Raw Silk Bandhgala with Emerald Buttons', category: 'Groom outfits', imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80', tags: ['Groom', 'Silk', 'Royal'], collectionId: 'col-3', order: 6 },
  { id: 'm-7', title: 'Warm Ivory & Champagne Palette Swatch', category: 'Color palettes', imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80', tags: ['Palette', 'Champagne', 'Warm Ivory'], collectionId: 'col-1', order: 7 }
]

export const defaultInvitation: Invitation = {
  id: 'inv-1',
  title: 'Royal Udaipur Wedding Invitation Suite',
  template: 'Royal',
  coupleNames: 'Aanya & Rohan',
  eventName: 'The Auspicious Wedding Ceremony (Pheras)',
  date: 'Saturday, November 28, 2026',
  time: '4:00 PM onwards',
  venue: 'The Oberoi Udaivilas Lakeside Promontory',
  address: 'Lake Pichola, Udaipur, Rajasthan',
  dressCode: 'Royal Heritage Red, Ivory & Gold Silks',
  personalMessage: 'With the blessings of our ancestors and families, we invite you to witness and celebrate our union beneath the Udaipur sky.',
  primaryColor: '#B99A62',
  accentColor: '#292725',
  fontFamily: 'serif',
  backgroundStyle: 'palace-arches',
  qrCodeEnabled: true,
  rsvpDeadline: 'October 25, 2026'
}

export const defaultWebsiteConfig: WeddingWebsiteConfig = {
  theme: 'Elegant',
  heroTitle: 'Aanya & Rohan',
  heroSubtitle: 'Celebrate our love under the Udaipur sky • November 26–29, 2026',
  heroImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
  storyTitle: 'How It All Began',
  storyText: 'What started over filter coffee in Bandra turned into countless flight tickets, shared playlists, and a mutual promise to explore every corner of the world together.',
  storyImage: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
  venueTitle: 'The Oberoi Udaivilas, Udaipur',
  venueDetails: 'Overlooking the tranquil waters of Lake Pichola, surrounded by domes, arched corridors, and fragrant courtyards.',
  venueImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
  sections: [
    { id: 'sec-hero', name: 'Hero Banner', enabled: true, order: 1 },
    { id: 'sec-story', name: 'Our Love Story', enabled: true, order: 2 },
    { id: 'sec-schedule', name: 'Celebration Schedule', enabled: true, order: 3 },
    { id: 'sec-venue', name: 'Venue & Travel Accommodations', enabled: true, order: 4 },
    { id: 'sec-gallery', name: 'Inspiration & Moments Gallery', enabled: true, order: 5 },
    { id: 'sec-rsvp', name: 'Digital RSVP Portal', enabled: true, order: 6 },
    { id: 'sec-faq', name: 'Guest FAQs & Dress Codes', enabled: true, order: 7 }
  ],
  faqs: [
    { question: 'What is the closest airport to the venue?', answer: 'Maharana Pratap Airport (UDR) is 45 minutes by car. Complimentary airport shuttles are coordinated for all registered guests.' },
    { question: 'What is the dress code for the Sangeet night?', answer: 'Glamorous ethnic evening wear — mirror work lehengas, sequined sarees, or formal bandhgalas and tuxedos.' },
    { question: 'Are children invited to the evening celebrations?', answer: 'Yes! We have arranged dedicated child-care activity cabanas and kid-friendly dining stations at Udaivilas.' }
  ],
  published: true,
  customSlug: 'aanya-and-rohan-2026'
}

export const defaultCollaborationActivity: CollaborationActivity[] = [
  { id: 'act-1', authorName: 'Aanya Sharma', authorRole: 'Partner', action: 'Approved guest RSVP', target: 'Natasha Verma & Plus One', timestamp: '2 hours ago' },
  { id: 'act-2', authorName: 'Rohan Kapoor', authorRole: 'Partner', action: 'Logged payment advance', target: 'The Oberoi Udaivilas (₹10,00,000)', timestamp: '5 hours ago' },
  { id: 'act-3', authorName: 'Devika Narain', authorRole: 'Planner', action: 'Added task', target: 'Source fresh marigolds for Haldi', timestamp: '1 day ago' },
  { id: 'act-4', authorName: 'Pooja Auntie', authorRole: 'Family', action: 'Completed task', target: 'Reviewed sound restriction policy', timestamp: '2 days ago' }
]

export const defaultNotifications: Notification[] = [
  { id: 'notif-1', title: 'Payment Reminder Due Soon', message: 'Remaining balance for The Oberoi Udaivilas is due on October 15, 2026.', category: 'payment', read: false, createdAt: '1 hour ago', actionUrl: '/budget' },
  { id: 'notif-2', title: 'New RSVP Received', message: 'Arjun Mehta confirmed attendance for the Wedding & Reception.', category: 'rsvp', read: false, createdAt: '3 hours ago', actionUrl: '/guests' },
  { id: 'notif-3', title: 'Task Deadline Approaching', message: '"Order organic petals & gulal for Haldi" is due next week.', category: 'task', read: true, createdAt: '1 day ago', actionUrl: '/checklist' },
  { id: 'notif-4', title: 'Vendor Shortlist Updated', message: 'Devika Narain & Company has been marked as Booked.', category: 'vendor', read: true, createdAt: '3 days ago', actionUrl: '/shortlist' }
]
