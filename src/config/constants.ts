export const BRAND = {
  name: 'EverAfter',
  tagline: 'Every detail. One beautiful beginning.',
  description: 'Plan your celebration, bring your ideas together, and make every moment unforgettable.',
  category: 'Wedding planning and event management',
  creator: 'Designed & Developed by Infinvo Tech',
  creatorUrl: 'https://infinvo-tech.vercel.app/',
  copyright: '© 2026 EverAfter. All rights reserved.',
  demoNotice: 'Demo Application — All vendors, venues, guests, and payment statuses are fictional local demo data.'
}

export const CURRENCIES = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'AED', symbol: 'AED ', name: 'UAE Dirham' },
  { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'AU$', name: 'Australian Dollar' },
]

export const WEDDING_TRADITIONS = [
  { id: 'roka', name: 'Roka Ceremony', defaultDuration: 3, icon: 'Sparkles', color: '#B99A62' },
  { id: 'engagement', name: 'Engagement / Sagai', defaultDuration: 4, icon: 'Heart', color: '#D9B8B0' },
  { id: 'haldi', name: 'Haldi Ceremony', defaultDuration: 3, icon: 'Sun', color: '#E8D8B9' },
  { id: 'mehendi', name: 'Mehendi Celebration', defaultDuration: 5, icon: 'Palette', color: '#AAB5A0' },
  { id: 'sangeet', name: 'Sangeet & Dance Night', defaultDuration: 6, icon: 'Music', color: '#B99A62' },
  { id: 'wedding', name: 'Wedding Pheras / Ceremony', defaultDuration: 5, icon: 'Flame', color: '#BD968D' },
  { id: 'reception', name: 'Grand Reception', defaultDuration: 5, icon: 'Wine', color: '#292725' },
  { id: 'afterparty', name: 'After-Party & Jam', defaultDuration: 4, icon: 'Disc', color: '#77716B' },
]

export const CELEBRATION_STYLES = [
  { id: 'traditional', name: 'Traditional Heritage', desc: 'Rich cultural rituals, palatial grandeur, classic ceremonial decor' },
  { id: 'modern', name: 'Contemporary Chic', desc: 'Sleek aesthetics, architectural floristry, elevated cocktail vibes' },
  { id: 'minimal', name: 'Refined Minimalist', desc: 'Subtle elegance, natural textures, intimate curation' },
  { id: 'royal', name: 'Royal Rajputana', desc: 'Grand palaces, brass lanterns, regal processions, timeless opulence' },
  { id: 'garden', name: 'Romantic Garden', desc: 'Open lawns, pastel blooms, botanical canopies, daylight festivities' },
  { id: 'destination', name: 'Destination Extravaganza', desc: 'Scenic getaways, curated multi-day guest itineraries' },
  { id: 'custom', name: 'Bespoke Fusion', desc: 'A personalized blend of cultural heritage and modern celebrations' }
]

export const BUDGET_DEFAULT_CATEGORIES = [
  { id: 'venue', name: 'Venue & Stays', defaultShare: 28, color: '#B99A62' },
  { id: 'catering', name: 'Catering & Beverages', defaultShare: 24, color: '#D8C29D' },
  { id: 'decoration', name: 'Decor & Florals', defaultShare: 16, color: '#AAB5A0' },
  { id: 'photography', name: 'Photography', defaultShare: 8, color: '#D9B8B0' },
  { id: 'videography', name: 'Cinematography', defaultShare: 6, color: '#BD968D' },
  { id: 'clothing', name: 'Bridal & Groom Attire', defaultShare: 7, color: '#77716B' },
  { id: 'jewellery', name: 'Jewellery & Accessories', defaultShare: 4, color: '#937740' },
  { id: 'makeup', name: 'Hair & Makeup Artistry', defaultShare: 3, color: '#EAD7D2' },
  { id: 'entertainment', name: 'Music, DJ & Artists', defaultShare: 4, color: '#58524D' },
  { id: 'invitations', name: 'Stationery & Invitations', defaultShare: 2, color: '#C7D1BF' },
  { id: 'transportation', name: 'Logistics & Transport', defaultShare: 3, color: '#A39D97' },
  { id: 'accommodation', name: 'Guest Hospitality', defaultShare: 5, color: '#3C3936' },
  { id: 'gifts', name: 'Favors & Gifting', defaultShare: 2, color: '#E8D8B9' },
  { id: 'miscellaneous', name: 'Contingency Fund', defaultShare: 3, color: '#292725' },
]
