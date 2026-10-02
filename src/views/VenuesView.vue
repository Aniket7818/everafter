<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Building2,
  Search,
  Filter,
  Star,
  MapPin,
  Users,
  Coins,
  Bookmark,
  BookmarkCheck,
  CheckCircle,
  Eye,
  SlidersHorizontal,
  Send,
  Sparkles,
  ArrowRight
} from 'lucide-vue-next'
import { useVendorStore } from '@/stores/vendors'
import { useWorkspaceStore } from '@/stores/workspace'
import Modal from '@/components/common/Modal.vue'
import { formatCurrency } from '@/utils/currency'
import type { Venue } from '@/types'

const vendorStore = useVendorStore()
const workspaceStore = useWorkspaceStore()

const searchQuery = ref('')
const selectedCity = ref('')
const selectedVenueType = ref('')
const minCapacity = ref<number | null>(null)
const sortBy = ref<'rating' | 'price-asc' | 'price-desc' | 'capacity'>('rating')

const selectedVenue = ref<Venue | null>(null)
const isDetailsModalOpen = ref(false)
const isInquirySuccess = ref(false)

const venueTypes = [
  'Palace',
  'Resort',
  'Banquet Hall',
  'Farmhouse',
  'Garden',
  'Hotel',
  'Destination Venue',
  'Outdoor Space'
]

const cities = ['Udaipur', 'Jaipur', 'Goa', 'Bishangarh', 'Bangalore', 'Mumbai', 'Delhi']

function viewVenueDetails(venue: Venue) {
  selectedVenue.value = venue
  isInquirySuccess.value = false
  isDetailsModalOpen.value = true
}

const inquiryForm = ref({
  eventDate: workspaceStore.weddingDate || '2026-11-28',
  guestCount: workspaceStore.workspace.estimatedGuests.total || 350,
  message: 'Hello, we are interested in hosting our multi-day wedding celebration at your property!'
})

function handleSendInquiry() {
  if (!selectedVenue.value) return

  vendorStore.sendInquiry({
    itemId: selectedVenue.value.id,
    itemType: 'venue',
    itemName: selectedVenue.value.name,
    eventDate: inquiryForm.value.eventDate,
    guestCount: inquiryForm.value.guestCount,
    estimatedBudget: selectedVenue.value.startingPrice,
    message: inquiryForm.value.message
  })

  isInquirySuccess.value = true
}

const filteredVenues = computed(() => {
  return vendorStore.venues
    .filter(v => {
      // Search
      if (searchQuery.value.trim()) {
        const q = searchQuery.value.toLowerCase()
        const matchesName = v.name.toLowerCase().includes(q)
        const matchesDesc = v.description.toLowerCase().includes(q)
        if (!matchesName && !matchesDesc) return false
      }

      // City
      if (selectedCity.value && v.city !== selectedCity.value) return false

      // Venue type
      if (selectedVenueType.value && v.venueType !== selectedVenueType.value) return false

      // Min capacity
      if (minCapacity.value && v.capacity < minCapacity.value) return false

      return true
    })
    .sort((a, b) => {
      if (sortBy.value === 'rating') return b.rating - a.rating
      if (sortBy.value === 'price-asc') return a.startingPrice - b.startingPrice
      if (sortBy.value === 'price-desc') return b.startingPrice - a.startingPrice
      if (sortBy.value === 'capacity') return b.capacity - a.capacity
      return 0
    })
})
</script>

<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-serif font-bold text-charcoal dark:text-ivory">Heritage Venues &amp; Palaces</h1>
        <p class="text-xs text-warmgray">Royal Rajputana palaces, lakeside terraces, botanical glasshouses, and coastal resorts</p>
      </div>

      <router-link 
        to="/shortlist"
        class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-ivory dark:bg-charcoal-900 border border-champagne/60 text-xs font-semibold text-charcoal dark:text-ivory hover:border-gold transition-colors"
      >
        <BookmarkCheck class="w-4 h-4 text-gold" />
        <span>Venue Shortlist ({{ vendorStore.shortlistedVenues.length }})</span>
      </router-link>
    </div>

    <!-- Search & Filters -->
    <div class="p-6 rounded-3xl bg-white dark:bg-charcoal border border-champagne/40 dark:border-charcoal-light shadow-soft space-y-4">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <!-- Search bar -->
        <div class="relative lg:col-span-2">
          <Search class="w-3.5 h-3.5 text-warmgray absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Search venue name, palace, hotel..."
            class="w-full pl-8 pr-3 py-2 rounded-xl bg-ivory dark:bg-charcoal-900 border border-champagne/50 text-xs focus:outline-hidden focus:border-gold"
          />
        </div>

        <!-- City filter -->
        <select 
          v-model="selectedCity"
          class="px-3 py-2 rounded-xl bg-ivory dark:bg-charcoal-900 border border-champagne/50 text-xs focus:outline-hidden"
        >
          <option value="">All Destinations</option>
          <option v-for="c in cities" :key="c" :value="c">{{ c }}</option>
        </select>

        <!-- Type filter -->
        <select 
          v-model="selectedVenueType"
          class="px-3 py-2 rounded-xl bg-ivory dark:bg-charcoal-900 border border-champagne/50 text-xs focus:outline-hidden"
        >
          <option value="">All Property Types</option>
          <option v-for="t in venueTypes" :key="t" :value="t">{{ t }}</option>
        </select>

        <!-- Sort by -->
        <select 
          v-model="sortBy"
          class="px-3 py-2 rounded-xl bg-ivory dark:bg-charcoal-900 border border-champagne/50 text-xs focus:outline-hidden"
        >
          <option value="rating">Sort: Highest Rating</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="capacity">Guest Capacity</option>
        </select>
      </div>
    </div>

    <!-- Venue Cards Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="venue in filteredVenues" 
        :key="venue.id"
        class="rounded-3xl overflow-hidden bg-white dark:bg-charcoal border border-champagne/40 dark:border-charcoal-light shadow-soft hover:shadow-luxury transition-all duration-300 flex flex-col justify-between group"
      >
        <div>
          <!-- Image -->
          <div class="relative h-60 overflow-hidden">
            <img 
              :src="venue.coverImage" 
              :alt="venue.name" 
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div class="absolute top-4 left-4 px-3 py-1 rounded-full bg-charcoal/80 backdrop-blur-xs text-[10px] font-semibold text-ivory">
              {{ venue.venueType }} • {{ venue.indoorOutdoor }}
            </div>

            <!-- Bookmark Button -->
            <button 
              type="button" 
              @click.stop="vendorStore.toggleShortlist('venue', venue.id)"
              class="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/90 dark:bg-charcoal/90 backdrop-blur-xs flex items-center justify-center transition-transform hover:scale-110 shadow-sm"
              :class="vendorStore.isShortlisted(venue.id, 'venue') ? 'text-gold' : 'text-warmgray'"
              title="Save to shortlist"
            >
              <BookmarkCheck v-if="vendorStore.isShortlisted(venue.id, 'venue')" class="w-4 h-4 fill-gold text-gold" />
              <Bookmark v-else class="w-4 h-4" />
            </button>

            <div class="absolute bottom-4 left-4 px-2.5 py-1 rounded-xl bg-white/95 dark:bg-charcoal/95 backdrop-blur-xs text-xs font-bold text-charcoal dark:text-ivory flex items-center gap-1 shadow-sm">
              <Star class="w-3.5 h-3.5 fill-gold text-gold" />
              <span>{{ venue.rating }}</span>
              <span class="text-warmgray font-normal">({{ venue.reviewCount }})</span>
            </div>
          </div>

          <!-- Body -->
          <div class="p-6 space-y-3">
            <div class="flex items-center gap-1 text-[11px] text-warmgray">
              <MapPin class="w-3 h-3 text-gold" />
              <span>{{ venue.city }}, {{ venue.state }}</span>
              <span>•</span>
              <Users class="w-3 h-3 text-gold" />
              <span>Up to {{ venue.capacity }} Guests</span>
            </div>

            <h3 class="font-serif text-xl font-bold text-charcoal dark:text-ivory group-hover:text-gold transition-colors">
              {{ venue.name }}
            </h3>

            <p class="text-xs text-warmgray line-clamp-2 leading-relaxed">
              {{ venue.description }}
            </p>

            <!-- Amenities Badges -->
            <div class="flex flex-wrap gap-1.5 pt-1">
              <span 
                v-for="amenity in venue.amenities.slice(0, 3)" 
                :key="amenity"
                class="px-2 py-0.5 rounded-md bg-ivory dark:bg-charcoal-900 text-[10px] text-warmgray border border-champagne/30"
              >
                {{ amenity }}
              </span>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="p-6 pt-0 mt-4 border-t border-champagne/20 dark:border-charcoal-light/20 flex items-center justify-between">
          <div>
            <span class="text-[10px] text-warmgray block">Starting rental / buyout</span>
            <span class="font-serif font-bold text-base text-charcoal dark:text-ivory">
              {{ formatCurrency(venue.startingPrice, venue.currency) }}
            </span>
          </div>

          <button 
            type="button" 
            @click="viewVenueDetails(venue)"
            class="px-4 py-2 rounded-xl text-xs font-semibold bg-gold hover:bg-gold-dark text-white transition-colors shadow-xs"
          >
            Explore Venue
          </button>
        </div>
      </div>
    </div>

    <!-- Venue Details Modal -->
    <Modal :is-open="isDetailsModalOpen" size="xl" @close="isDetailsModalOpen = false">
      <div v-if="selectedVenue" class="space-y-6">
        <!-- Cover Banner -->
        <div class="relative h-72 rounded-2xl overflow-hidden">
          <img :src="selectedVenue.coverImage" class="w-full h-full object-cover" />
          <div class="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent flex items-end p-6">
            <div class="text-white space-y-1">
              <span class="text-[10px] uppercase font-bold tracking-widest text-champagne">{{ selectedVenue.venueType }} • {{ selectedVenue.indoorOutdoor }}</span>
              <h2 class="font-serif text-3xl font-bold">{{ selectedVenue.name }}</h2>
              <div class="flex items-center gap-3 text-xs text-white/80">
                <span class="flex items-center gap-1"><MapPin class="w-3.5 h-3.5 text-gold" /> {{ selectedVenue.city }}, {{ selectedVenue.state }}</span>
                <span>•</span>
                <span class="flex items-center gap-1"><Users class="w-3.5 h-3.5 text-gold" /> Capacity: {{ selectedVenue.capacity }} guests</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Description -->
        <div class="space-y-2">
          <h4 class="font-serif text-lg font-bold text-charcoal dark:text-ivory">Estate Overview</h4>
          <p class="text-xs text-warmgray dark:text-warmgray-light leading-relaxed">
            {{ selectedVenue.description }}
          </p>
        </div>

        <!-- Amenities -->
        <div class="space-y-2">
          <h4 class="font-serif text-lg font-bold text-charcoal dark:text-ivory">Curated Amenities &amp; Services</h4>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <div 
              v-for="am in selectedVenue.amenities" 
              :key="am"
              class="p-2.5 rounded-xl bg-ivory dark:bg-charcoal-900 border border-champagne/40 text-xs flex items-center gap-2"
            >
              <CheckCircle class="w-3.5 h-3.5 text-gold" />
              <span>{{ am }}</span>
            </div>
          </div>
        </div>

        <!-- Demo Inquiry Box -->
        <div class="p-6 rounded-2xl bg-ivory dark:bg-charcoal-900 border border-gold/40 space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h4 class="font-serif text-base font-bold text-charcoal dark:text-ivory">Request Venue Availability (Demo)</h4>
              <p class="text-[11px] text-warmgray">Simulate booking inquiry and lock demo date</p>
            </div>
            <span class="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-champagne text-gold-dark">Demo Simulation</span>
          </div>

          <div v-if="isInquirySuccess" class="p-4 rounded-xl bg-emerald-100 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle class="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Venue inquiry saved locally! Track inquiry status from your Shortlist page.</span>
          </div>

          <form v-else @submit.prevent="handleSendInquiry" class="space-y-3 text-xs">
            <div class="grid grid-cols-2 gap-3">
              <input v-model="inquiryForm.eventDate" type="date" class="px-3 py-2 rounded-xl bg-white dark:bg-charcoal border border-champagne/60 text-xs" />
              <input v-model.number="inquiryForm.guestCount" type="number" placeholder="Expected Guests" class="px-3 py-2 rounded-xl bg-white dark:bg-charcoal border border-champagne/60 text-xs" />
            </div>
            <textarea v-model="inquiryForm.message" rows="2" class="w-full px-3 py-2 rounded-xl bg-white dark:bg-charcoal border border-champagne/60 text-xs"></textarea>
            <div class="flex justify-end">
              <button type="submit" class="px-5 py-2 rounded-xl bg-gold hover:bg-gold-dark text-white font-semibold flex items-center gap-1.5 shadow-xs">
                <Send class="w-3.5 h-3.5" />
                <span>Submit Venue Inquiry</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  </div>
</template>
