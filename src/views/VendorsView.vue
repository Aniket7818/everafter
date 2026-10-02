<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  ShoppingBag,
  Search,
  Filter,
  Star,
  MapPin,
  Bookmark,
  BookmarkCheck,
  Calendar,
  Send,
  CheckCircle,
  ExternalLink,
  Phone,
  Mail,
  Instagram,
  Sparkles,
  ChevronRight
} from 'lucide-vue-next'
import { useVendorStore } from '@/stores/vendors'
import { useWorkspaceStore } from '@/stores/workspace'
import Modal from '@/components/common/Modal.vue'
import { formatCurrency } from '@/utils/currency'
import type { Vendor } from '@/types'

const vendorStore = useVendorStore()
const workspaceStore = useWorkspaceStore()

const searchQuery = ref('')
const selectedCategory = ref('')
const selectedCity = ref('')
const selectedMaxPrice = ref<number | null>(null)

const selectedVendor = ref<Vendor | null>(null)
const isDetailsModalOpen = ref(false)
const isInquirySuccess = ref(false)

const inquiryForm = ref({
  eventDate: workspaceStore.weddingDate || '2026-11-28',
  guestCount: workspaceStore.workspace.estimatedGuests.total || 300,
  estimatedBudget: 500000,
  message: 'Hello, we would love to check availability for our wedding celebrations!'
})

function viewVendorDetails(vendor: Vendor) {
  selectedVendor.value = vendor
  isInquirySuccess.value = false
  isDetailsModalOpen.value = true
}

function handleSendInquiry() {
  if (!selectedVendor.value) return

  vendorStore.sendInquiry({
    itemId: selectedVendor.value.id,
    itemType: 'vendor',
    itemName: selectedVendor.value.name,
    eventDate: inquiryForm.value.eventDate,
    guestCount: inquiryForm.value.guestCount,
    estimatedBudget: inquiryForm.value.estimatedBudget,
    message: inquiryForm.value.message
  })

  isInquirySuccess.value = true
}

const categories = [
  'Photographer',
  'Caterer',
  'Decorator',
  'Mehendi artist',
  'Makeup artist',
  'DJ and entertainment',
  'Wedding planner'
]

const cities = ['Mumbai', 'Delhi', 'Jaipur', 'Udaipur', 'Goa', 'Bangalore']

const filteredVendors = computed(() => {
  return vendorStore.vendors.filter(v => {
    // Search
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase()
      const matchesName = v.name.toLowerCase().includes(q)
      const matchesDesc = v.shortDescription.toLowerCase().includes(q)
      if (!matchesName && !matchesDesc) return false
    }

    // Category
    if (selectedCategory.value && v.category !== selectedCategory.value) return false

    // City
    if (selectedCity.value && v.city !== selectedCity.value) return false

    // Max Price
    if (selectedMaxPrice.value && v.startingPrice > selectedMaxPrice.value) return false

    return true
  })
})
</script>

<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-serif font-bold text-charcoal dark:text-ivory">Curated Vendor Marketplace</h1>
        <p class="text-xs text-warmgray">Discover verified artists, royal caterers, cinematographers, and event stylists</p>
      </div>

      <router-link 
        to="/shortlist"
        class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-ivory dark:bg-charcoal-900 border border-champagne/60 text-xs font-semibold text-charcoal dark:text-ivory hover:border-gold transition-colors"
      >
        <BookmarkCheck class="w-4 h-4 text-gold" />
        <span>View Shortlist ({{ vendorStore.shortlist.length }})</span>
      </router-link>
    </div>

    <!-- Search & Filters -->
    <div class="p-6 rounded-3xl bg-white dark:bg-charcoal border border-champagne/40 dark:border-charcoal-light shadow-soft space-y-4">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <!-- Search bar -->
        <div class="relative">
          <Search class="w-3.5 h-3.5 text-warmgray absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Search by vendor name..."
            class="w-full pl-8 pr-3 py-2 rounded-xl bg-ivory dark:bg-charcoal-900 border border-champagne/50 text-xs focus:outline-hidden focus:border-gold"
          />
        </div>

        <!-- Category -->
        <select 
          v-model="selectedCategory"
          class="px-3 py-2 rounded-xl bg-ivory dark:bg-charcoal-900 border border-champagne/50 text-xs focus:outline-hidden"
        >
          <option value="">All Categories</option>
          <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
        </select>

        <!-- City -->
        <select 
          v-model="selectedCity"
          class="px-3 py-2 rounded-xl bg-ivory dark:bg-charcoal-900 border border-champagne/50 text-xs focus:outline-hidden"
        >
          <option value="">All Cities</option>
          <option v-for="c in cities" :key="c" :value="c">{{ c }}</option>
        </select>

        <!-- Price limit -->
        <select 
          v-model="selectedMaxPrice"
          class="px-3 py-2 rounded-xl bg-ivory dark:bg-charcoal-900 border border-champagne/50 text-xs focus:outline-hidden"
        >
          <option :value="null">Any Price Range</option>
          <option :value="100000">Under ₹1,00,000</option>
          <option :value="500000">Under ₹5,00,000</option>
          <option :value="1000000">Under ₹10,00,000</option>
        </select>
      </div>
    </div>

    <!-- Vendor Cards Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="vendor in filteredVendors" 
        :key="vendor.id"
        class="rounded-3xl overflow-hidden bg-white dark:bg-charcoal border border-champagne/40 dark:border-charcoal-light shadow-soft hover:shadow-luxury transition-all duration-300 flex flex-col justify-between group"
      >
        <div>
          <!-- Image -->
          <div class="relative h-56 overflow-hidden">
            <img 
              :src="vendor.coverImage" 
              :alt="vendor.name" 
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div class="absolute top-4 left-4 px-3 py-1 rounded-full bg-charcoal/80 backdrop-blur-xs text-[10px] font-semibold text-ivory">
              {{ vendor.category }}
            </div>
            
            <!-- Bookmark Button -->
            <button 
              type="button" 
              @click.stop="vendorStore.toggleShortlist('vendor', vendor.id)"
              class="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/90 dark:bg-charcoal/90 backdrop-blur-xs flex items-center justify-center transition-transform hover:scale-110 shadow-sm"
              :class="vendorStore.isShortlisted(vendor.id, 'vendor') ? 'text-gold' : 'text-warmgray'"
              title="Save to shortlist"
            >
              <BookmarkCheck v-if="vendorStore.isShortlisted(vendor.id, 'vendor')" class="w-4 h-4 fill-gold text-gold" />
              <Bookmark v-else class="w-4 h-4" />
            </button>

            <div class="absolute bottom-4 left-4 px-2.5 py-1 rounded-xl bg-white/95 dark:bg-charcoal/95 backdrop-blur-xs text-xs font-bold text-charcoal dark:text-ivory flex items-center gap-1 shadow-sm">
              <Star class="w-3.5 h-3.5 fill-gold text-gold" />
              <span>{{ vendor.rating }}</span>
              <span class="text-warmgray font-normal">({{ vendor.reviewCount }})</span>
            </div>
          </div>

          <!-- Body -->
          <div class="p-6 space-y-3">
            <div class="flex items-center gap-1 text-[11px] text-warmgray">
              <MapPin class="w-3 h-3 text-gold" />
              <span>{{ vendor.city }}, {{ vendor.state }}</span>
              <span>•</span>
              <span class="text-gold font-medium">{{ vendor.availabilityLabel }}</span>
            </div>

            <h3 class="font-serif text-xl font-bold text-charcoal dark:text-ivory group-hover:text-gold transition-colors">
              {{ vendor.name }}
            </h3>

            <p class="text-xs text-warmgray line-clamp-2 leading-relaxed">
              {{ vendor.shortDescription }}
            </p>

            <!-- Features Tags -->
            <div class="flex flex-wrap gap-1.5 pt-1">
              <span 
                v-for="feat in vendor.features.slice(0, 3)" 
                :key="feat"
                class="px-2 py-0.5 rounded-md bg-ivory dark:bg-charcoal-900 text-[10px] text-warmgray border border-champagne/30"
              >
                {{ feat }}
              </span>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="p-6 pt-0 mt-4 border-t border-champagne/20 dark:border-charcoal-light/20 flex items-center justify-between">
          <div>
            <span class="text-[10px] text-warmgray block">Starting package</span>
            <span class="font-serif font-bold text-base text-charcoal dark:text-ivory">
              {{ formatCurrency(vendor.startingPrice, vendor.currency) }}
            </span>
          </div>

          <button 
            type="button" 
            @click="viewVendorDetails(vendor)"
            class="px-4 py-2 rounded-xl text-xs font-semibold bg-gold hover:bg-gold-dark text-white transition-colors shadow-xs"
          >
            View Details
          </button>
        </div>
      </div>
    </div>

    <!-- Details Modal -->
    <Modal :is-open="isDetailsModalOpen" size="xl" @close="isDetailsModalOpen = false">
      <div v-if="selectedVendor" class="space-y-6">
        <!-- Banner -->
        <div class="relative h-64 rounded-2xl overflow-hidden">
          <img :src="selectedVendor.coverImage" class="w-full h-full object-cover" />
          <div class="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent flex items-end p-6">
            <div class="text-white space-y-1">
              <span class="text-[10px] uppercase font-bold tracking-widest text-champagne">{{ selectedVendor.category }}</span>
              <h2 class="font-serif text-2xl font-bold">{{ selectedVendor.name }}</h2>
              <div class="flex items-center gap-3 text-xs text-white/80">
                <span>{{ selectedVendor.city }}</span>
                <span>•</span>
                <span class="flex items-center gap-1 text-gold"><Star class="w-3 h-3 fill-gold" /> {{ selectedVendor.rating }} ({{ selectedVendor.reviewCount }} reviews)</span>
              </div>
            </div>
          </div>
        </div>

        <!-- About Description -->
        <div class="space-y-2">
          <h4 class="font-serif text-lg font-bold text-charcoal dark:text-ivory">About the Artist</h4>
          <p class="text-xs text-warmgray dark:text-warmgray-light leading-relaxed">
            {{ selectedVendor.longDescription }}
          </p>
        </div>

        <!-- Packages List -->
        <div v-if="selectedVendor.packages?.length" class="space-y-3">
          <h4 class="font-serif text-lg font-bold text-charcoal dark:text-ivory">Signature Packages</h4>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div 
              v-for="pkg in selectedVendor.packages" 
              :key="pkg.id"
              class="p-4 rounded-2xl bg-ivory dark:bg-charcoal-900 border border-champagne/40 space-y-2"
            >
              <div class="flex items-center justify-between">
                <span class="font-serif font-bold text-sm text-charcoal dark:text-ivory">{{ pkg.name }}</span>
                <span class="font-bold text-xs text-gold">{{ formatCurrency(pkg.price, selectedVendor.currency) }}</span>
              </div>
              <ul class="text-[11px] text-warmgray space-y-1 list-disc list-inside">
                <li v-for="deliv in pkg.deliverables" :key="deliv">{{ deliv }}</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Demo Reviews Section -->
        <div v-if="selectedVendor.reviews?.length" class="space-y-3">
          <h4 class="font-serif text-lg font-bold text-charcoal dark:text-ivory">Couples' Reviews (Demo)</h4>
          <div class="space-y-3">
            <div 
              v-for="rev in selectedVendor.reviews" 
              :key="rev.id"
              class="p-4 rounded-xl bg-ivory/50 dark:bg-charcoal-900 border border-champagne/30 text-xs space-y-1"
            >
              <div class="flex items-center justify-between font-bold">
                <span>{{ rev.author }}</span>
                <span class="text-gold flex items-center gap-1"><Star class="w-3 h-3 fill-gold" /> {{ rev.rating }}/5</span>
              </div>
              <p class="text-warmgray italic">“{{ rev.comment }}”</p>
            </div>
          </div>
        </div>

        <!-- Demo Inquiry Box -->
        <div class="p-6 rounded-2xl bg-ivory dark:bg-charcoal-900 border border-gold/40 space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h4 class="font-serif text-base font-bold text-charcoal dark:text-ivory">Send Direct Inquiry (Demo)</h4>
              <p class="text-[11px] text-warmgray">Simulate sending availability inquiry to this vendor</p>
            </div>
            <span class="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-champagne text-gold-dark">Demo Simulation</span>
          </div>

          <div v-if="isInquirySuccess" class="p-4 rounded-xl bg-emerald-100 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle class="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Inquiry recorded in your demo workspace! You can track vendor response status on the Shortlist &amp; Compare page.</span>
          </div>

          <form v-else @submit.prevent="handleSendInquiry" class="space-y-3 text-xs">
            <div class="grid grid-cols-2 gap-3">
              <input v-model="inquiryForm.eventDate" type="date" class="px-3 py-2 rounded-xl bg-white dark:bg-charcoal border border-champagne/60 text-xs" />
              <input v-model.number="inquiryForm.estimatedBudget" type="number" placeholder="Estimated Budget" class="px-3 py-2 rounded-xl bg-white dark:bg-charcoal border border-champagne/60 text-xs font-mono" />
            </div>
            <textarea v-model="inquiryForm.message" rows="2" class="w-full px-3 py-2 rounded-xl bg-white dark:bg-charcoal border border-champagne/60 text-xs"></textarea>
            <div class="flex justify-end">
              <button type="submit" class="px-5 py-2 rounded-xl bg-gold hover:bg-gold-dark text-white font-semibold flex items-center gap-1.5 shadow-xs">
                <Send class="w-3.5 h-3.5" />
                <span>Submit Demo Inquiry</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  </div>
</template>
