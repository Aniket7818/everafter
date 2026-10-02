<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  BookmarkCheck,
  Building2,
  ShoppingBag,
  Star,
  CheckCircle,
  X,
  Trash2,
  Edit2,
  Plus,
  Coins,
  ArrowRight,
  Scale
} from 'lucide-vue-next'
import { useVendorStore } from '@/stores/vendors'
import { useBudgetStore } from '@/stores/budget'
import { useWorkspaceStore } from '@/stores/workspace'
import Modal from '@/components/common/Modal.vue'
import { formatCurrency } from '@/utils/currency'
import type { ShortlistItem } from '@/types'

const vendorStore = useVendorStore()
const budgetStore = useBudgetStore()
const workspaceStore = useWorkspaceStore()

const currentTab = ref<'all' | 'vendors' | 'venues'>('all')
const isCompareModalOpen = ref(false)
const selectedToCompare = ref<string[]>([]) // item IDs

const editingNotesId = ref<string | null>(null)
const notesText = ref('')

function openEditNotes(item: ShortlistItem) {
  editingNotesId.value = item.id
  notesText.value = item.notes || ''
}

function saveNotes(id: string) {
  vendorStore.updateShortlistItem(id, { notes: notesText.value })
  editingNotesId.value = null
}

function toggleCompare(id: string) {
  const idx = selectedToCompare.value.indexOf(id)
  if (idx !== -1) {
    selectedToCompare.value.splice(idx, 1)
  } else {
    if (selectedToCompare.value.length < 4) {
      selectedToCompare.value.push(id)
    }
  }
}

function toggleBooked(item: ShortlistItem) {
  vendorStore.markAsBooked(item.itemId, item.itemType)
}

function addCostToBudget(item: ShortlistItem) {
  let name = ''
  let catId = budgetStore.categories[0]?.id || 'cat-venue'
  if (item.itemType === 'vendor') {
    const v = vendorStore.vendors.find(vend => vend.id === item.itemId)
    name = v?.name || 'Vendor Expense'
  } else {
    const ven = vendorStore.venues.find(v => v.id === item.itemId)
    name = ven?.name || 'Venue Booking'
    const venueCat = budgetStore.categories.find(c => c.name.toLowerCase().includes('venue'))
    if (venueCat) catId = venueCat.id
  }

  budgetStore.addExpense({
    title: name,
    categoryId: catId,
    estimatedAmount: item.estimatedCost || 100000,
    actualAmount: item.estimatedCost || 100000,
    paidAmount: 0,
    paymentStatus: 'pending',
    expenseDate: new Date().toISOString().slice(0, 10),
    notes: 'Added directly from Shortlist.'
  })

  alert(`Added ${name} to your Budget planner!`)
}

// Full items with metadata
const enrichedShortlist = computed(() => {
  return vendorStore.shortlist.map(s => {
    if (s.itemType === 'vendor') {
      const vendor = vendorStore.vendors.find(v => v.id === s.itemId)
      return {
        ...s,
        title: vendor?.name || 'Vendor',
        category: vendor?.category || 'Vendor',
        city: vendor?.city || '',
        price: vendor?.startingPrice || 0,
        rating: vendor?.rating || 4.9,
        image: vendor?.coverImage || '',
        rawItem: vendor
      }
    } else {
      const venue = vendorStore.venues.find(v => v.id === s.itemId)
      return {
        ...s,
        title: venue?.name || 'Venue',
        category: venue?.venueType || 'Venue',
        city: venue?.city || '',
        price: venue?.startingPrice || 0,
        rating: venue?.rating || 4.9,
        image: venue?.coverImage || '',
        rawItem: venue
      }
    }
  })
})

const filteredItems = computed(() => {
  if (currentTab.value === 'vendors') return enrichedShortlist.value.filter(i => i.itemType === 'vendor')
  if (currentTab.value === 'venues') return enrichedShortlist.value.filter(i => i.itemType === 'venue')
  return enrichedShortlist.value
})

const compareItems = computed(() => {
  return enrichedShortlist.value.filter(i => selectedToCompare.value.includes(i.id))
})
</script>

<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-serif font-bold text-charcoal dark:text-ivory">Vendor &amp; Venue Shortlist</h1>
        <p class="text-xs text-warmgray">Compare saved selections, track inquiry responses, and link estimates to your budget</p>
      </div>

      <div class="flex items-center gap-3">
        <button 
          type="button" 
          @click="isCompareModalOpen = true"
          :disabled="selectedToCompare.length < 2"
          class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold hover:bg-gold-dark disabled:opacity-40 text-white text-xs font-semibold shadow-soft transition-colors"
        >
          <Scale class="w-4 h-4" />
          <span>Compare Selected ({{ selectedToCompare.length }}/4)</span>
        </button>
      </div>
    </div>

    <!-- Filter Tabs -->
    <div class="flex items-center gap-1 p-1 rounded-xl bg-ivory dark:bg-charcoal-900 border border-champagne/40 w-fit text-xs">
      <button 
        type="button" 
        @click="currentTab = 'all'"
        class="px-4 py-1.5 rounded-lg font-semibold transition-colors"
        :class="currentTab === 'all' ? 'bg-white dark:bg-charcoal text-gold shadow-xs' : 'text-warmgray'"
      >
        All Saved ({{ enrichedShortlist.length }})
      </button>
      <button 
        type="button" 
        @click="currentTab = 'vendors'"
        class="px-4 py-1.5 rounded-lg font-semibold transition-colors"
        :class="currentTab === 'vendors' ? 'bg-white dark:bg-charcoal text-gold shadow-xs' : 'text-warmgray'"
      >
        Vendors ({{ vendorStore.shortlistedVendors.length }})
      </button>
      <button 
        type="button" 
        @click="currentTab = 'venues'"
        class="px-4 py-1.5 rounded-lg font-semibold transition-colors"
        :class="currentTab === 'venues' ? 'bg-white dark:bg-charcoal text-gold shadow-xs' : 'text-warmgray'"
      >
        Venues ({{ vendorStore.shortlistedVenues.length }})
      </button>
    </div>

    <!-- Shortlist Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="item in filteredItems" 
        :key="item.id"
        class="rounded-3xl overflow-hidden bg-white dark:bg-charcoal border border-champagne/40 dark:border-charcoal-light shadow-soft flex flex-col justify-between group"
      >
        <div>
          <!-- Image Banner -->
          <div class="relative h-48 overflow-hidden">
            <img :src="item.image" :alt="item.title" class="w-full h-full object-cover" />
            <div class="absolute top-4 left-4 px-3 py-1 rounded-full bg-charcoal/80 text-[10px] font-semibold text-ivory">
              {{ item.category }} • {{ item.city }}
            </div>

            <!-- Compare Checkbox -->
            <label class="absolute top-4 right-4 px-2.5 py-1 rounded-xl bg-white/95 dark:bg-charcoal/95 text-[10px] font-semibold flex items-center gap-1.5 shadow-sm cursor-pointer">
              <input 
                type="checkbox" 
                :checked="selectedToCompare.includes(item.id)"
                @change="toggleCompare(item.id)"
                class="w-3.5 h-3.5 rounded text-gold focus:ring-gold"
              />
              <span>Compare</span>
            </label>

            <!-- Booked Badge -->
            <div 
              v-if="item.isBooked"
              class="absolute bottom-4 left-4 px-3 py-1 rounded-full bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm"
            >
              <CheckCircle class="w-3 h-3" />
              <span>Confirmed Booking</span>
            </div>
          </div>

          <!-- Body -->
          <div class="p-6 space-y-3">
            <div class="flex items-start justify-between gap-2">
              <h3 class="font-serif text-lg font-bold text-charcoal dark:text-ivory truncate">{{ item.title }}</h3>
              <span class="text-xs font-serif font-bold text-gold shrink-0">
                {{ formatCurrency(item.price, workspaceStore.currency) }}
              </span>
            </div>

            <!-- Notes Section -->
            <div class="p-3 rounded-xl bg-ivory dark:bg-charcoal-900 border border-champagne/40 text-xs space-y-1">
              <div class="flex items-center justify-between text-[10px] text-warmgray uppercase font-semibold">
                <span>Personal Notes</span>
                <button type="button" @click="openEditNotes(item)" class="text-gold hover:underline">
                  {{ item.notes ? 'Edit' : '+ Add Note' }}
                </button>
              </div>

              <div v-if="editingNotesId === item.id" class="space-y-2 pt-1">
                <textarea v-model="notesText" rows="2" class="w-full p-2 rounded-lg bg-white dark:bg-charcoal text-xs border border-champagne/60"></textarea>
                <div class="flex justify-end gap-1">
                  <button type="button" @click="editingNotesId = null" class="px-2 py-1 text-[10px] text-warmgray">Cancel</button>
                  <button type="button" @click="saveNotes(item.id)" class="px-2 py-1 text-[10px] bg-gold text-white rounded">Save</button>
                </div>
              </div>
              <p v-else class="text-warmgray italic line-clamp-2">
                {{ item.notes || 'No notes added yet.' }}
              </p>
            </div>
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="p-6 pt-0 mt-4 border-t border-champagne/20 dark:border-charcoal-light/20 flex items-center justify-between gap-2 text-xs">
          <button 
            type="button" 
            @click="toggleBooked(item)"
            class="px-3 py-1.5 rounded-xl font-semibold transition-colors"
            :class="item.isBooked ? 'bg-emerald-100 text-emerald-800' : 'bg-ivory dark:bg-charcoal-900 text-warmgray hover:text-gold'"
          >
            {{ item.isBooked ? 'Marked as Booked' : 'Mark Booked' }}
          </button>

          <div class="flex items-center gap-1">
            <button 
              type="button" 
              @click="addCostToBudget(item)"
              class="p-2 rounded-xl text-warmgray hover:text-gold"
              title="Add to budget expenses"
            >
              <Coins class="w-4 h-4" />
            </button>
            <button 
              type="button" 
              @click="vendorStore.removeFromShortlist(item.id)"
              class="p-2 rounded-xl text-warmgray hover:text-rose-dark"
              title="Remove from shortlist"
            >
              <Trash2 class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Compare Modal (Up to 4 options side-by-side) -->
    <Modal :is-open="isCompareModalOpen" title="Side-by-Side Comparison" size="2xl" @close="isCompareModalOpen = false">
      <div class="space-y-6 overflow-x-auto text-xs">
        <p class="text-warmgray">Neutral comparison matrix for your shortlisted selections.</p>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 min-w-[600px]">
          <div 
            v-for="item in compareItems" 
            :key="item.id"
            class="p-4 rounded-2xl bg-ivory dark:bg-charcoal-900 border border-champagne/50 space-y-4"
          >
            <img :src="item.image" class="w-full h-32 object-cover rounded-xl" />
            <div>
              <span class="text-[10px] uppercase font-bold text-gold">{{ item.category }}</span>
              <h4 class="font-serif font-bold text-base text-charcoal dark:text-ivory">{{ item.title }}</h4>
              <div class="text-[11px] text-warmgray">{{ item.city }}</div>
            </div>

            <div class="space-y-2 border-t border-champagne/30 pt-3 text-[11px]">
              <div>
                <span class="text-warmgray block">Starting Price:</span>
                <span class="font-bold text-gold">{{ formatCurrency(item.price, workspaceStore.currency) }}</span>
              </div>

              <div>
                <span class="text-warmgray block">Rating:</span>
                <span class="font-bold flex items-center gap-1 text-charcoal dark:text-ivory">
                  <Star class="w-3 h-3 fill-gold text-gold" /> {{ item.rating }}/5
                </span>
              </div>

              <div v-if="item.itemType === 'venue'">
                <span class="text-warmgray block">Capacity:</span>
                <span class="font-bold text-charcoal dark:text-ivory">{{ (item.rawItem as any)?.capacity }} Guests</span>
              </div>

              <div>
                <span class="text-warmgray block">Booking Status:</span>
                <span class="font-bold" :class="item.isBooked ? 'text-emerald-600' : 'text-warmgray'">
                  {{ item.isBooked ? 'Booked' : 'Shortlisted' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  </div>
</template>
