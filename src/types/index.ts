export type CurrencyCode = 'INR' | 'USD' | 'EUR' | 'GBP' | 'AED' | 'CAD' | 'AUD'

export interface CoupleProfile {
  partner1Name: string
  partner2Name: string
  partner1Title?: string
  partner2Title?: string
  weddingTitle: string
  email?: string
  phone?: string
  avatar1?: string
  avatar2?: string
  story?: string
}

export interface WeddingEvent {
  id: string
  name: string
  date: string // YYYY-MM-DD
  startTime: string // HH:mm
  endTime: string // HH:mm
  venue: string
  description: string
  dressCode?: string
  assignedVendorIds: string[]
  assignedTaskIds: string[]
  notes?: string
  order: number
}

export interface Subtask {
  id: string
  title: string
  completed: boolean
}

export type TaskPriority = 'Low' | 'Medium' | 'High'

export interface Task {
  id: string
  title: string
  description?: string
  completed: boolean
  dueDate: string // YYYY-MM-DD
  priority: TaskPriority
  category: string
  assignedTo: string // e.g. Partner 1, Partner 2, Planner, Family
  eventId?: string
  subtasks: Subtask[]
  notes?: string
  createdAt: string
  updatedAt?: string
}

export type PaymentStatus = 'paid' | 'pending' | 'partially_paid'

export interface Expense {
  id: string
  title: string
  categoryId: string
  vendorId?: string
  eventId?: string
  estimatedAmount: number
  actualAmount: number
  paidAmount: number
  paymentStatus: PaymentStatus
  expenseDate: string // YYYY-MM-DD
  dueDate?: string // YYYY-MM-DD
  notes?: string
  receiptName?: string // demo metadata only
}

export interface BudgetCategory {
  id: string
  name: string
  allocatedAmount: number
  color: string
}

export type GuestSide = 'Partner A' | 'Partner B' | 'Both' | 'Other'
export type RSVPStatus = 'Pending' | 'Accepted' | 'Declined'
export type MealPreference = 'Vegetarian' | 'Non-Vegetarian' | 'Vegan' | 'Jain' | 'Halal' | 'Gluten-Free' | 'Any'

export interface Guest {
  id: string
  code: string // e.g. "EA-7892" unique RSVP code
  fullName: string
  email?: string
  phone?: string
  side: GuestSide
  group: string // Family, College Friends, Work, Relatives, etc.
  accompanyingGuests: number
  invitedEventIds: string[]
  rsvpStatus: RSVPStatus
  mealPreference: MealPreference
  dietaryRequirements?: string
  accessibilityNotes?: string
  internalNotes?: string
  tableId?: string
  seatNumber?: number
}

export type TableShape = 'Round' | 'Rectangle' | 'Square'

export interface Table {
  id: string
  name: string
  shape: TableShape
  capacity: number
  eventId: string
  x?: number
  y?: number
}

export interface SeatingAssignment {
  tableId: string
  guestId: string
  seatIndex: number
}

export interface VendorReview {
  id: string
  author: string
  rating: number
  date: string
  comment: string
}

export interface VendorPackage {
  id: string
  name: string
  price: number
  deliverables: string[]
}

export interface Vendor {
  id: string
  name: string
  category: string
  city: string
  state?: string
  rating: number
  reviewCount: number
  startingPrice: number
  currency: CurrencyCode
  shortDescription: string
  longDescription: string
  coverImage: string
  galleryImages: string[]
  availabilityLabel: string
  features: string[]
  packages: VendorPackage[]
  reviews: VendorReview[]
  contactEmail: string
  contactPhone: string
  instagram?: string
  isFeatured?: boolean
}

export interface Venue {
  id: string
  name: string
  city: string
  state?: string
  venueType: 'Palace' | 'Resort' | 'Banquet Hall' | 'Farmhouse' | 'Garden' | 'Hotel' | 'Destination Venue' | 'Outdoor Space'
  capacity: number
  startingPrice: number
  currency: CurrencyCode
  indoorOutdoor: 'Indoor' | 'Outdoor' | 'Both'
  amenities: string[]
  coverImage: string
  galleryImages: string[]
  description: string
  rating: number
  reviewCount: number
  address: string
  contactEmail: string
  contactPhone: string
  isFeatured?: boolean
}

export interface VendorInquiry {
  id: string
  itemId: string // vendor or venue ID
  itemType: 'vendor' | 'venue'
  itemName: string
  eventDate: string
  guestCount?: number
  estimatedBudget?: number
  message: string
  status: 'Inquired' | 'Reviewing' | 'Negotiating' | 'Booked' | 'Declined'
  createdAt: string
}

export interface ShortlistItem {
  id: string
  itemType: 'vendor' | 'venue'
  itemId: string
  notes?: string
  isPreferred: boolean
  estimatedCost?: number
  isBooked: boolean
  addedAt: string
}

export interface CalendarEvent {
  id: string
  title: string
  start: string // ISO date or date string
  end?: string
  allDay?: boolean
  category: 'function' | 'vendor_meeting' | 'payment_due' | 'task_deadline' | 'personal'
  description?: string
  color?: string
  location?: string
}

export interface MoodboardItem {
  id: string
  title: string
  category: 'Decoration' | 'Bridal outfits' | 'Groom outfits' | 'Flowers' | 'Stage design' | 'Table settings' | 'Photography' | 'Invitations' | 'Color palettes'
  imageUrl: string
  notes?: string
  tags: string[]
  aspectRatio?: 'square' | 'portrait' | 'landscape'
  collectionId: string
  order: number
}

export interface MoodboardCollection {
  id: string
  title: string
  description?: string
  coverImage?: string
  isDefault?: boolean
}

export type InvitationTemplate = 'Minimal' | 'Floral' | 'Royal' | 'Modern' | 'Traditional Indian' | 'Garden' | 'Destination'

export interface Invitation {
  id: string
  title: string
  template: InvitationTemplate
  coupleNames: string
  eventName: string
  date: string
  time: string
  venue: string
  address: string
  dressCode?: string
  personalMessage: string
  primaryColor: string
  accentColor: string
  fontFamily: 'serif' | 'sans'
  backgroundStyle: 'clean' | 'gold-border' | 'botanical' | 'palace-arches' | 'damask'
  qrCodeEnabled: boolean
  rsvpDeadline?: string
}

export interface WeddingWebsiteSection {
  id: string
  name: string
  enabled: boolean
  order: number
}

export interface WeddingWebsiteConfig {
  theme: 'Elegant' | 'Minimal' | 'Floral'
  heroTitle: string
  heroSubtitle: string
  heroImage: string
  storyTitle: string
  storyText: string
  storyImage: string
  venueTitle: string
  venueDetails: string
  venueImage: string
  sections: WeddingWebsiteSection[]
  faqs: { question: string; answer: string }[]
  published: boolean
  customSlug?: string
}

export interface CollaborationActivity {
  id: string
  authorName: string
  authorRole: 'Partner' | 'Family' | 'Planner' | 'Admin'
  action: string
  target: string
  timestamp: string
}

export interface Notification {
  id: string
  title: string
  message: string
  category: 'task' | 'payment' | 'event' | 'rsvp' | 'vendor' | 'budget'
  read: boolean
  createdAt: string
  actionUrl?: string
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system'
  currency: CurrencyCode
  dateFormat: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD'
  notifyOnTasks: boolean
  notifyOnPayments: boolean
  notifyOnRsvp: boolean
}

export interface WeddingWorkspace {
  id: string
  createdAt: string
  updatedAt: string
  couple: CoupleProfile
  weddingDate?: string // YYYY-MM-DD or undefined if TBD
  isDateDecided: boolean
  location: {
    city: string
    state?: string
    country: string
  }
  budget: {
    total: number
    currency: CurrencyCode
  }
  estimatedGuests: {
    total: number
    partner1Count?: number
    partner2Count?: number
  }
  celebrationStyle: string
}
