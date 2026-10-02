<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Users,
  Plus,
  Download,
  Search,
  Filter,
  CheckCircle,
  Clock,
  XCircle,
  ExternalLink,
  Edit2,
  Trash2,
  Utensils,
  UserPlus,
  Copy,
  Check
} from 'lucide-vue-next'
import { useGuestStore } from '@/stores/guests'
import { useTimelineStore } from '@/stores/timeline'
import { useWorkspaceStore } from '@/stores/workspace'
import Modal from '@/components/common/Modal.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import MetricCard from '@/components/common/MetricCard.vue'
import RSVPBarChart from '@/components/charts/RSVPBarChart.vue'
import type { Guest, GuestSide, RSVPStatus, MealPreference } from '@/types'

const guestStore = useGuestStore()
const timelineStore = useTimelineStore()
const workspaceStore = useWorkspaceStore()

const searchQuery = ref('')
const selectedSideFilter = ref('')
const selectedRsvpFilter = ref('')
const selectedGroupFilter = ref('')
const sortBy = ref<'name' | 'side' | 'rsvp'>('name')

const isAddGuestModalOpen = ref(false)
const isBulkAddModalOpen = ref(false)
const isDeleteDialogOpen = ref(false)
const guestToDeleteId = ref<string | null>(null)
const editingGuestId = ref<string | null>(null)
const copiedCode = ref<string | null>(null)

const guestForm = ref({
  fullName: '',
  email: '',
  phone: '',
  side: 'Partner A' as GuestSide,
  group: 'Family',
  accompanyingGuests: 0,
  invitedEventIds: [] as string[],
  rsvpStatus: 'Pending' as RSVPStatus,
  mealPreference: 'Vegetarian' as MealPreference,
  dietaryRequirements: '',
  accessibilityNotes: '',
  internalNotes: ''
})

const bulkText = ref('')
const bulkSide = ref<GuestSide>('Partner A')
const bulkGroup = ref('Friends')

function openGuestModal(guest?: Guest) {
  if (guest) {
    editingGuestId.value = guest.id
    guestForm.value = {
      fullName: guest.fullName,
      email: guest.email || '',
      phone: guest.phone || '',
      side: guest.side,
      group: guest.group,
      accompanyingGuests: guest.accompanyingGuests,
      invitedEventIds: [...(guest.invitedEventIds || [])],
      rsvpStatus: guest.rsvpStatus,
      mealPreference: guest.mealPreference,
      dietaryRequirements: guest.dietaryRequirements || '',
      accessibilityNotes: guest.accessibilityNotes || '',
      internalNotes: guest.internalNotes || ''
    }
  } else {
    editingGuestId.value = null
    guestForm.value = {
      fullName: '',
      email: '',
      phone: '',
      side: 'Partner A',
      group: 'Family',
      accompanyingGuests: 0,
      invitedEventIds: timelineStore.events.map(e => e.id),
      rsvpStatus: 'Pending',
      mealPreference: 'Vegetarian',
      dietaryRequirements: '',
      accessibilityNotes: '',
      internalNotes: ''
    }
  }
  isAddGuestModalOpen.value = true
}

function handleSaveGuest() {
  if (!guestForm.value.fullName.trim()) return

  if (editingGuestId.value) {
    guestStore.updateGuest(editingGuestId.value, guestForm.value)
  } else {
    guestStore.addGuest(guestForm.value)
  }
  isAddGuestModalOpen.value = false
}

function handleBulkAdd() {
  const names = bulkText.value.split('\n').filter(n => n.trim())
  if (names.length) {
    guestStore.bulkAddGuests(names, bulkSide.value, bulkGroup.value)
    bulkText.value = ''
    isBulkAddModalOpen.value = false
  }
}

function confirmDeleteGuest(id: string) {
  guestToDeleteId.value = id
  isDeleteDialogOpen.value = true
}

function executeDeleteGuest() {
  if (guestToDeleteId.value) {
    guestStore.deleteGuest(guestToDeleteId.value)
    guestToDeleteId.value = null
  }
  isDeleteDialogOpen.value = false
}

function copyRsvpLink(code: string) {
  const url = `${window.location.origin}/rsvp/${code}`
  navigator.clipboard.writeText(url)
  copiedCode.value = code
  setTimeout(() => {
    copiedCode.value = null
  }, 2500)
}

const groupsList = computed(() => {
  const groups = new Set<string>()
  guestStore.guests.forEach(g => { if (g.group) groups.add(g.group) })
  return Array.from(groups)
})

const filteredGuests = computed(() => {
  return guestStore.guests
    .filter(g => {
      // Search
      if (searchQuery.value.trim()) {
        const q = searchQuery.value.toLowerCase()
        const matchesName = g.fullName.toLowerCase().includes(q)
        const matchesCode = g.code.toLowerCase().includes(q)
        const matchesEmail = g.email?.toLowerCase().includes(q)
        if (!matchesName && !matchesCode && !matchesEmail) return false
      }

      // Side
      if (selectedSideFilter.value && g.side !== selectedSideFilter.value) return false
      // RSVP
      if (selectedRsvpFilter.value && g.rsvpStatus !== selectedRsvpFilter.value) return false
      // Group
      if (selectedGroupFilter.value && g.group !== selectedGroupFilter.value) return false

      return true
    })
    .sort((a, b) => {
      if (sortBy.value === 'name') return a.fullName.localeCompare(b.fullName)
      if (sortBy.value === 'side') return a.side.localeCompare(b.side)
      if (sortBy.value === 'rsvp') return a.rsvpStatus.localeCompare(b.rsvpStatus)
      return 0
    })
})
</script>

<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-serif font-bold text-charcoal dark:text-ivory">Guest List &amp; RSVP Management</h1>
        <p class="text-xs text-warmgray">Manage party headcounts, dietary requirements, and digital demo RSVP links</p>
      </div>

      <div class="flex items-center gap-3">
        <button 
          type="button" 
          @click="guestStore.exportGuestsCSV"
          class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white dark:bg-charcoal border border-champagne/60 dark:border-charcoal-light text-xs font-semibold text-charcoal dark:text-ivory shadow-xs hover:border-gold transition-colors"
        >
          <Download class="w-3.5 h-3.5 text-gold" />
          <span>Export CSV</span>
        </button>

        <button 
          type="button" 
          @click="isBulkAddModalOpen = true"
          class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-ivory dark:bg-charcoal-900 border border-champagne/60 dark:border-charcoal-light text-xs font-semibold text-charcoal dark:text-ivory hover:border-gold transition-colors"
        >
          <UserPlus class="w-3.5 h-3.5 text-gold" />
          <span>Bulk Add</span>
        </button>

        <button 
          type="button" 
          @click="openGuestModal()"
          class="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gold hover:bg-gold-dark text-white text-xs font-semibold shadow-soft transition-colors"
        >
          <Plus class="w-4 h-4" />
          <span>Add Guest</span>
        </button>
      </div>
    </div>

    <!-- RSVP KPI Cards -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <MetricCard 
        title="Total Headcount" 
        :value="guestStore.totalHeadcount"
        :subtitle="`${guestStore.totalEntries} invitations sent`"
        trend="Invited"
        trend-type="neutral"
      />
      <MetricCard 
        title="Confirmed Attending" 
        :value="guestStore.acceptedCount"
        :subtitle="`${guestStore.responseRate}% response rate`"
        trend="Accepted"
        trend-type="positive"
      />
      <MetricCard 
        title="Pending Responses" 
        :value="guestStore.pendingCount"
        subtitle="Awaiting response"
        trend="Pending"
        trend-type="warning"
      />
      <MetricCard 
        title="Declined" 
        :value="guestStore.declinedCount"
        subtitle="Unable to attend"
        trend="Declined"
        trend-type="alert"
      />
    </div>

    <!-- Meal Preferences & Side Breakdown Bar Charts -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="p-6 rounded-3xl bg-white dark:bg-charcoal border border-champagne/40 dark:border-charcoal-light shadow-soft space-y-4">
        <div>
          <h3 class="font-serif text-lg font-bold text-charcoal dark:text-ivory">Dietary &amp; Meal Preferences</h3>
          <p class="text-xs text-warmgray">Catering headcounts for executive chef</p>
        </div>
        <div class="h-48">
          <RSVPBarChart 
            :labels="Object.keys(guestStore.mealSummary)" 
            :data="Object.values(guestStore.mealSummary)" 
          />
        </div>
      </div>

      <div class="p-6 rounded-3xl bg-white dark:bg-charcoal border border-champagne/40 dark:border-charcoal-light shadow-soft space-y-4">
        <div>
          <h3 class="font-serif text-lg font-bold text-charcoal dark:text-ivory">Guest Distribution by Side</h3>
          <p class="text-xs text-warmgray">Balance between families</p>
        </div>
        <div class="h-48">
          <RSVPBarChart 
            :labels="Object.keys(guestStore.sideBreakdown)" 
            :data="Object.values(guestStore.sideBreakdown)" 
            :colors="['#B99A62', '#D8C29D', '#AAB5A0', '#77716B']"
          />
        </div>
      </div>
    </div>

    <!-- Main Table Card -->
    <div class="p-6 rounded-3xl bg-white dark:bg-charcoal border border-champagne/40 dark:border-charcoal-light shadow-soft space-y-6">
      <!-- Search, Filters and Sort -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="relative flex-1 max-w-sm">
          <Search class="w-3.5 h-3.5 text-warmgray absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Search by guest name, code, email..."
            class="w-full pl-8 pr-3 py-2 rounded-xl bg-ivory dark:bg-charcoal-900 border border-champagne/50 dark:border-charcoal-light text-xs text-charcoal dark:text-ivory focus:outline-hidden focus:border-gold"
          />
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <!-- Filter by Side -->
          <select 
            v-model="selectedSideFilter"
            class="px-3 py-1.5 rounded-xl bg-ivory dark:bg-charcoal-900 border border-champagne/50 text-xs text-charcoal dark:text-ivory focus:outline-hidden"
          >
            <option value="">All Sides</option>
            <option value="Partner A">Partner A</option>
            <option value="Partner B">Partner B</option>
            <option value="Both">Mutual Friends</option>
            <option value="Other">Other</option>
          </select>

          <!-- Filter by RSVP -->
          <select 
            v-model="selectedRsvpFilter"
            class="px-3 py-1.5 rounded-xl bg-ivory dark:bg-charcoal-900 border border-champagne/50 text-xs text-charcoal dark:text-ivory focus:outline-hidden"
          >
            <option value="">All RSVP</option>
            <option value="Accepted">Accepted</option>
            <option value="Pending">Pending</option>
            <option value="Declined">Declined</option>
          </select>

          <!-- Filter by Group -->
          <select 
            v-model="selectedGroupFilter"
            class="px-3 py-1.5 rounded-xl bg-ivory dark:bg-charcoal-900 border border-champagne/50 text-xs text-charcoal dark:text-ivory focus:outline-hidden"
          >
            <option value="">All Groups</option>
            <option v-for="grp in groupsList" :key="grp" :value="grp">{{ grp }}</option>
          </select>

          <!-- Sort -->
          <select 
            v-model="sortBy"
            class="px-3 py-1.5 rounded-xl bg-ivory dark:bg-charcoal-900 border border-champagne/50 text-xs text-charcoal dark:text-ivory focus:outline-hidden"
          >
            <option value="name">Sort: Name (A-Z)</option>
            <option value="side">Sort: Side</option>
            <option value="rsvp">Sort: RSVP</option>
          </select>
        </div>
      </div>

      <!-- Guest Table -->
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead>
            <tr class="border-b border-champagne/30 dark:border-charcoal-light text-[11px] font-semibold text-warmgray uppercase tracking-wider">
              <th class="py-3 px-3">Guest Name &amp; Code</th>
              <th class="py-3 px-3">Side &amp; Group</th>
              <th class="py-3 px-3 text-center">Party Size</th>
              <th class="py-3 px-3">RSVP Status</th>
              <th class="py-3 px-3">Meal &amp; Notes</th>
              <th class="py-3 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-champagne/20 dark:divide-charcoal-light/20">
            <tr 
              v-for="guest in filteredGuests" 
              :key="guest.id"
              class="hover:bg-ivory/50 dark:hover:bg-charcoal-900 transition-colors group"
            >
              <!-- Name & Code -->
              <td class="py-3.5 px-3">
                <div class="font-medium text-charcoal dark:text-ivory">{{ guest.fullName }}</div>
                <div class="flex items-center gap-2 mt-0.5">
                  <span class="font-mono text-[10px] text-warmgray bg-champagne/20 dark:bg-charcoal-light px-1.5 py-0.5 rounded">
                    {{ guest.code }}
                  </span>
                  <!-- Copy Demo RSVP Link -->
                  <button 
                    type="button" 
                    @click="copyRsvpLink(guest.code)"
                    class="text-[10px] text-gold hover:underline flex items-center gap-0.5"
                    title="Copy unique RSVP link for this guest"
                  >
                    <Check v-if="copiedCode === guest.code" class="w-2.5 h-2.5 text-emerald-500" />
                    <Copy v-else class="w-2.5 h-2.5" />
                    <span>{{ copiedCode === guest.code ? 'Copied' : 'RSVP Link' }}</span>
                  </button>
                  <router-link 
                    :to="`/rsvp/${guest.code}`" 
                    target="_blank"
                    class="text-warmgray hover:text-gold"
                    title="Test public RSVP view in new tab"
                  >
                    <ExternalLink class="w-2.5 h-2.5" />
                  </router-link>
                </div>
              </td>

              <!-- Side & Group -->
              <td class="py-3.5 px-3">
                <div class="text-charcoal dark:text-ivory font-medium">{{ guest.side }}</div>
                <div class="text-[11px] text-warmgray">{{ guest.group }}</div>
              </td>

              <!-- Party Size -->
              <td class="py-3.5 px-3 text-center">
                <span class="font-bold text-charcoal dark:text-ivory">
                  {{ 1 + (guest.accompanyingGuests || 0) }}
                </span>
                <span class="text-[10px] text-warmgray block">
                  (1 + {{ guest.accompanyingGuests }})
                </span>
              </td>

              <!-- RSVP Status -->
              <td class="py-3.5 px-3">
                <span 
                  class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase inline-flex items-center gap-1"
                  :class="{
                    'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200': guest.rsvpStatus === 'Accepted',
                    'bg-champagne/40 text-gold-dark dark:text-gold-light': guest.rsvpStatus === 'Pending',
                    'bg-rose/20 text-rose-dark dark:text-rose-light': guest.rsvpStatus === 'Declined'
                  }"
                >
                  <CheckCircle v-if="guest.rsvpStatus === 'Accepted'" class="w-3 h-3" />
                  <Clock v-else-if="guest.rsvpStatus === 'Pending'" class="w-3 h-3" />
                  <XCircle v-else class="w-3 h-3" />
                  <span>{{ guest.rsvpStatus }}</span>
                </span>
              </td>

              <!-- Meal & Notes -->
              <td class="py-3.5 px-3">
                <div class="text-charcoal dark:text-ivory font-medium">{{ guest.mealPreference }}</div>
                <div v-if="guest.dietaryRequirements" class="text-[10px] text-rose-dark line-clamp-1">
                  {{ guest.dietaryRequirements }}
                </div>
                <div v-if="guest.internalNotes" class="text-[10px] text-warmgray line-clamp-1 italic">
                  {{ guest.internalNotes }}
                </div>
              </td>

              <!-- Actions -->
              <td class="py-3.5 px-3 text-right">
                <div class="flex items-center justify-end gap-1">
                  <button 
                    type="button" 
                    @click="openGuestModal(guest)"
                    class="p-1.5 rounded-lg text-warmgray hover:text-gold hover:bg-champagne/20 transition-colors"
                    title="Edit guest"
                  >
                    <Edit2 class="w-3.5 h-3.5" />
                  </button>
                  <button 
                    type="button" 
                    @click="confirmDeleteGuest(guest.id)"
                    class="p-1.5 rounded-lg text-warmgray hover:text-rose-dark hover:bg-rose/20 transition-colors"
                    title="Delete guest"
                  >
                    <Trash2 class="w-3.5 h-3.5" />
                  </button>
                </div>
              </td>
            </tr>

            <tr v-if="filteredGuests.length === 0">
              <td colspan="6" class="py-8 text-center text-warmgray text-xs">
                No guests found matching the current search filters.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal: Add / Edit Guest -->
    <Modal 
      :is-open="isAddGuestModalOpen" 
      :title="editingGuestId ? 'Edit Guest Details' : 'Add New Guest'" 
      size="lg" 
      @close="isAddGuestModalOpen = false"
    >
      <form @submit.prevent="handleSaveGuest" class="space-y-4 text-xs">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="space-y-1">
            <label class="font-semibold text-warmgray uppercase">Full Name *</label>
            <input 
              v-model="guestForm.fullName"
              type="text" 
              required
              placeholder="e.g. Vikram & Anjali Kapoor"
              class="w-full px-3.5 py-2.5 rounded-xl bg-ivory dark:bg-charcoal-900 border border-champagne/60 text-xs focus:outline-hidden focus:border-gold"
            />
          </div>

          <div class="space-y-1">
            <label class="font-semibold text-warmgray uppercase">Side of the Family</label>
            <select 
              v-model="guestForm.side"
              class="w-full px-3.5 py-2.5 rounded-xl bg-ivory dark:bg-charcoal-900 border border-champagne/60 text-xs focus:outline-hidden"
            >
              <option value="Partner A">Partner A ({{ workspaceStore.workspace.couple.partner1Name || 'Partner 1' }})</option>
              <option value="Partner B">Partner B ({{ workspaceStore.workspace.couple.partner2Name || 'Partner 2' }})</option>
              <option value="Both">Mutual Friends / Both Sides</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="space-y-1">
            <label class="font-semibold text-warmgray uppercase">Group / Circle</label>
            <input 
              v-model="guestForm.group"
              type="text" 
              placeholder="e.g. Immediate Family, College Friends"
              class="w-full px-3.5 py-2.5 rounded-xl bg-ivory dark:bg-charcoal-900 border border-champagne/60 text-xs focus:outline-hidden"
            />
          </div>

          <div class="space-y-1">
            <label class="font-semibold text-warmgray uppercase">Accompanying Guests (Plus Ones)</label>
            <input 
              v-model.number="guestForm.accompanyingGuests"
              type="number" 
              min="0"
              class="w-full px-3.5 py-2.5 rounded-xl bg-ivory dark:bg-charcoal-900 border border-champagne/60 text-xs focus:outline-hidden"
            />
          </div>

          <div class="space-y-1">
            <label class="font-semibold text-warmgray uppercase">RSVP Status</label>
            <select 
              v-model="guestForm.rsvpStatus"
              class="w-full px-3.5 py-2.5 rounded-xl bg-ivory dark:bg-charcoal-900 border border-champagne/60 text-xs focus:outline-hidden"
            >
              <option value="Pending">Pending</option>
              <option value="Accepted">Accepted</option>
              <option value="Declined">Declined</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="space-y-1">
            <label class="font-semibold text-warmgray uppercase">Meal Preference</label>
            <select 
              v-model="guestForm.mealPreference"
              class="w-full px-3.5 py-2.5 rounded-xl bg-ivory dark:bg-charcoal-900 border border-champagne/60 text-xs focus:outline-hidden"
            >
              <option value="Vegetarian">Vegetarian</option>
              <option value="Non-Vegetarian">Non-Vegetarian</option>
              <option value="Vegan">Vegan</option>
              <option value="Jain">Strictly Jain</option>
              <option value="Halal">Halal</option>
              <option value="Gluten-Free">Gluten-Free</option>
            </select>
          </div>

          <div class="space-y-1">
            <label class="font-semibold text-warmgray uppercase">Dietary Allergies / Restrictions</label>
            <input 
              v-model="guestForm.dietaryRequirements"
              type="text" 
              placeholder="e.g. Lactose intolerant, nut allergy"
              class="w-full px-3.5 py-2.5 rounded-xl bg-ivory dark:bg-charcoal-900 border border-champagne/60 text-xs focus:outline-hidden"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="space-y-1">
            <label class="font-semibold text-warmgray uppercase">Email (Private Demo Only)</label>
            <input 
              v-model="guestForm.email"
              type="email" 
              placeholder="guest@example.com"
              class="w-full px-3.5 py-2.5 rounded-xl bg-ivory dark:bg-charcoal-900 border border-champagne/60 text-xs focus:outline-hidden"
            />
          </div>

          <div class="space-y-1">
            <label class="font-semibold text-warmgray uppercase">Phone (Optional)</label>
            <input 
              v-model="guestForm.phone"
              type="tel" 
              placeholder="+91 98765 00000"
              class="w-full px-3.5 py-2.5 rounded-xl bg-ivory dark:bg-charcoal-900 border border-champagne/60 text-xs focus:outline-hidden"
            />
          </div>
        </div>

        <div class="space-y-1">
          <label class="font-semibold text-warmgray uppercase">Internal Notes / Seating Requests</label>
          <textarea 
            v-model="guestForm.internalNotes"
            rows="2"
            placeholder="Assign near front row mandap, hotel room needs elevator..."
            class="w-full px-3.5 py-2.5 rounded-xl bg-ivory dark:bg-charcoal-900 border border-champagne/60 text-xs focus:outline-hidden"
          ></textarea>
        </div>

        <div class="pt-4 flex items-center justify-end gap-2">
          <button type="button" @click="isAddGuestModalOpen = false" class="px-4 py-2 rounded-xl text-warmgray">Cancel</button>
          <button type="submit" class="px-5 py-2 rounded-xl bg-gold text-white font-semibold shadow-xs">
            {{ editingGuestId ? 'Save Changes' : 'Add Guest' }}
          </button>
        </div>
      </form>
    </Modal>

    <!-- Modal: Bulk Add Guests -->
    <Modal :is-open="isBulkAddModalOpen" title="Bulk Import Guests" size="md" @close="isBulkAddModalOpen = false">
      <form @submit.prevent="handleBulkAdd" class="space-y-4 text-xs">
        <p class="text-warmgray">
          Paste a list of guest names (one per line). Unique RSVP codes will be generated automatically for each guest.
        </p>

        <div class="grid grid-cols-2 gap-3">
          <div class="space-y-1">
            <label class="font-semibold text-warmgray uppercase">Default Side</label>
            <select v-model="bulkSide" class="w-full px-3 py-2 rounded-xl bg-ivory dark:bg-charcoal-900 border border-champagne/60 text-xs">
              <option value="Partner A">Partner A</option>
              <option value="Partner B">Partner B</option>
              <option value="Both">Both Sides</option>
            </select>
          </div>
          <div class="space-y-1">
            <label class="font-semibold text-warmgray uppercase">Default Group</label>
            <input v-model="bulkGroup" type="text" class="w-full px-3 py-2 rounded-xl bg-ivory dark:bg-charcoal-900 border border-champagne/60 text-xs" />
          </div>
        </div>

        <div class="space-y-1">
          <label class="font-semibold text-warmgray uppercase">Guest Names (One per line) *</label>
          <textarea 
            v-model="bulkText"
            rows="6"
            required
            placeholder="Aarav Saxena&#10;Kavita &amp; Nikhil Roy&#10;Dr. Sanjay Mehra"
            class="w-full p-3 rounded-xl bg-ivory dark:bg-charcoal-900 border border-champagne/60 font-mono text-xs focus:outline-hidden"
          ></textarea>
        </div>

        <div class="pt-4 flex items-center justify-end gap-2">
          <button type="button" @click="isBulkAddModalOpen = false" class="px-4 py-2 rounded-xl text-warmgray">Cancel</button>
          <button type="submit" class="px-5 py-2 rounded-xl bg-gold text-white font-semibold">Import All</button>
        </div>
      </form>
    </Modal>

    <!-- Confirm Delete Dialog -->
    <ConfirmDialog 
      :is-open="isDeleteDialogOpen"
      title="Delete Guest"
      message="Are you sure you want to remove this guest from the invitation list? Any assigned seats will also be cleared."
      confirm-text="Delete"
      :is-destructive="true"
      @confirm="executeDeleteGuest"
      @cancel="isDeleteDialogOpen = false"
    />
  </div>
</template>
