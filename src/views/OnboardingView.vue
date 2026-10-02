<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Calendar,
  MapPin,
  Coins,
  Users,
  Palette,
  PartyPopper,
  Plus,
  Trash2
} from 'lucide-vue-next'
import confetti from 'canvas-confetti'
import { CURRENCIES, CELEBRATION_STYLES, WEDDING_TRADITIONS } from '@/config/constants'
import { useWorkspaceStore } from '@/stores/workspace'
import { useTimelineStore } from '@/stores/timeline'
import { useBudgetStore } from '@/stores/budget'
import type { CurrencyCode } from '@/types'
import { formatCurrency } from '@/utils/currency'
import { getStoredItem, setStoredItem } from '@/utils/storage'

const router = useRouter()
const workspaceStore = useWorkspaceStore()
const timelineStore = useTimelineStore()
const budgetStore = useBudgetStore()

const currentStep = ref(1)
const totalSteps = 8

// Persistent draft state in case of page refresh
interface OnboardingDraft {
  partner1Name: string
  partner2Name: string
  weddingTitle: string
  isDateDecided: boolean
  weddingDate: string
  city: string
  state: string
  country: string
  currency: CurrencyCode
  budget: number
  guestCount: number
  partner1GuestCount: number
  partner2GuestCount: number
  celebrationStyle: string
  selectedTraditionIds: string[]
  customFunctions: { name: string; date: string }[]
}

const draft = ref<OnboardingDraft>(getStoredItem('onboarding_draft', {
  partner1Name: 'Aanya Sharma',
  partner2Name: 'Rohan Kapoor',
  weddingTitle: 'The Royal Celebrations of Aanya & Rohan',
  isDateDecided: true,
  weddingDate: '2026-11-28',
  city: 'Udaipur',
  state: 'Rajasthan',
  country: 'India',
  currency: 'INR',
  budget: 6500000,
  guestCount: 320,
  partner1GuestCount: 160,
  partner2GuestCount: 160,
  celebrationStyle: 'Royal Rajputana',
  selectedTraditionIds: ['haldi', 'mehendi', 'sangeet', 'wedding', 'reception'],
  customFunctions: []
}))

function saveDraft() {
  setStoredItem('onboarding_draft', draft.value)
}

const customFunctionName = ref('')
const customFunctionDate = ref('')

function addCustomFunction() {
  if (customFunctionName.value.trim()) {
    draft.value.customFunctions.push({
      name: customFunctionName.value.trim(),
      date: customFunctionDate.value || draft.value.weddingDate || ''
    })
    customFunctionName.value = ''
    customFunctionDate.value = ''
    saveDraft()
  }
}

function removeCustomFunction(index: number) {
  draft.value.customFunctions.splice(index, 1)
  saveDraft()
}

function toggleTradition(id: string) {
  const idx = draft.value.selectedTraditionIds.indexOf(id)
  if (idx !== -1) {
    draft.value.selectedTraditionIds.splice(idx, 1)
  } else {
    draft.value.selectedTraditionIds.push(id)
  }
  saveDraft()
}

// Validation per step
const isStepValid = computed(() => {
  switch (currentStep.value) {
    case 1:
      return !!draft.value.partner1Name.trim() && !!draft.value.partner2Name.trim()
    case 2:
      return !draft.value.isDateDecided || !!draft.value.weddingDate
    case 3:
      return !!draft.value.city.trim()
    case 4:
      return draft.value.budget > 0
    case 5:
      return draft.value.guestCount > 0
    case 6:
      return !!draft.value.celebrationStyle
    case 7:
      return draft.value.selectedTraditionIds.length > 0 || draft.value.customFunctions.length > 0
    case 8:
      return true
    default:
      return true
  }
})

function nextStep() {
  if (!isStepValid.value) return
  if (currentStep.value < totalSteps) {
    currentStep.value++
    saveDraft()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } else {
    completeOnboarding()
  }
}

function prevStep() {
  if (currentStep.value > 1) {
    currentStep.value--
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

function completeOnboarding() {
  const newWorkspaceId = `ws-${Date.now()}`

  // Apply to workspace store
  workspaceStore.workspace.id = newWorkspaceId
  workspaceStore.updateCouple({
    partner1Name: draft.value.partner1Name,
    partner2Name: draft.value.partner2Name,
    weddingTitle: draft.value.weddingTitle
  })
  workspaceStore.updateWeddingDate(draft.value.weddingDate, draft.value.isDateDecided)
  workspaceStore.updateLocation(draft.value.city, draft.value.state, draft.value.country)
  workspaceStore.updateBudgetTotal(draft.value.budget, draft.value.currency)
  workspaceStore.updateGuestEstimate(
    draft.value.guestCount,
    draft.value.partner1GuestCount,
    draft.value.partner2GuestCount
  )
  workspaceStore.updateCelebrationStyle(draft.value.celebrationStyle)

  // Configure timeline events from selection
  const selectedEvents = WEDDING_TRADITIONS.filter(t => draft.value.selectedTraditionIds.includes(t.id))
  const newEvents = selectedEvents.map((t, idx) => ({
    id: `evt-${t.id}-${Date.now()}`,
    name: t.name,
    date: draft.value.weddingDate || '2026-11-28',
    startTime: idx % 2 === 0 ? '11:00' : '18:00',
    endTime: idx % 2 === 0 ? '15:00' : '23:00',
    venue: `${draft.value.city} Heritage Pavilion`,
    description: `A joyful celebration of ${t.name} with friends and family.`,
    assignedVendorIds: [],
    assignedTaskIds: [],
    order: idx + 1
  }))

  // Add any custom functions
  draft.value.customFunctions.forEach((cf, idx) => {
    newEvents.push({
      id: `evt-custom-${Date.now()}-${idx}`,
      name: cf.name,
      date: cf.date || draft.value.weddingDate || '2026-11-28',
      startTime: '16:00',
      endTime: '20:00',
      venue: `${draft.value.city} Celebration Lawn`,
      description: 'Custom family function.',
      assignedVendorIds: [],
      assignedTaskIds: [],
      order: newEvents.length + 1
    })
  })

  if (newEvents.length) {
    timelineStore.reorderEvents(newEvents)
  }

  // Trigger celebration confetti
  try {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    })
  } catch {}

  // Redirect to dashboard
  setTimeout(() => {
    router.push('/dashboard')
  }, 1000)
}
</script>

<template>
  <div class="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto flex flex-col justify-between">
    <!-- Header with Step Indicator -->
    <div class="space-y-4 mb-8">
      <div class="flex items-center justify-between text-xs">
        <span class="font-semibold uppercase tracking-widest text-gold">Step {{ currentStep }} of {{ totalSteps }}</span>
        <span class="text-warmgray">{{ Math.round((currentStep / totalSteps) * 100) }}% Completed</span>
      </div>

      <!-- Progress Track -->
      <div class="w-full h-1.5 bg-champagne/40 dark:bg-charcoal-light rounded-full overflow-hidden">
        <div 
          class="h-full bg-gold transition-all duration-300 rounded-full"
          :style="{ width: `${(currentStep / totalSteps) * 100}%` }"
        ></div>
      </div>
    </div>

    <!-- Step Content Container -->
    <div class="bg-white dark:bg-charcoal rounded-3xl p-6 sm:p-10 shadow-soft border border-champagne/40 dark:border-charcoal-light/40 flex-1 flex flex-col justify-between">
      
      <!-- STEP 1: Couple Details -->
      <div v-if="currentStep === 1" class="space-y-6">
        <div class="space-y-1">
          <span class="text-xs font-semibold uppercase tracking-widest text-gold">Couple Profile</span>
          <h2 class="text-2xl sm:text-3xl font-serif font-bold text-charcoal dark:text-ivory">
            Who are we celebrating?
          </h2>
          <p class="text-xs sm:text-sm text-warmgray dark:text-warmgray-light">
            Enter both partner names. These will be featured across invitations, budget plans, and your wedding website.
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="space-y-1.5">
            <label class="text-xs font-semibold uppercase tracking-wider text-warmgray">Partner 1 Full Name *</label>
            <input 
              v-model="draft.partner1Name"
              type="text" 
              placeholder="e.g. Aanya Sharma" 
              class="w-full px-4 py-3 rounded-xl bg-ivory dark:bg-charcoal-900 border border-champagne/60 dark:border-charcoal-light text-sm focus:outline-hidden focus:border-gold"
            />
          </div>

          <div class="space-y-1.5">
            <label class="text-xs font-semibold uppercase tracking-wider text-warmgray">Partner 2 Full Name *</label>
            <input 
              v-model="draft.partner2Name"
              type="text" 
              placeholder="e.g. Rohan Kapoor" 
              class="w-full px-4 py-3 rounded-xl bg-ivory dark:bg-charcoal-900 border border-champagne/60 dark:border-charcoal-light text-sm focus:outline-hidden focus:border-gold"
            />
          </div>
        </div>

        <div class="space-y-1.5">
          <label class="text-xs font-semibold uppercase tracking-wider text-warmgray">Wedding Celebration Title (Optional)</label>
          <input 
            v-model="draft.weddingTitle"
            type="text" 
            placeholder="e.g. The Celebrations of Aanya & Rohan" 
            class="w-full px-4 py-3 rounded-xl bg-ivory dark:bg-charcoal-900 border border-champagne/60 dark:border-charcoal-light text-sm focus:outline-hidden focus:border-gold"
          />
        </div>
      </div>

      <!-- STEP 2: Wedding Date -->
      <div v-else-if="currentStep === 2" class="space-y-6">
        <div class="space-y-1">
          <span class="text-xs font-semibold uppercase tracking-widest text-gold">Timeline</span>
          <h2 class="text-2xl sm:text-3xl font-serif font-bold text-charcoal dark:text-ivory">
            When is the big day?
          </h2>
          <p class="text-xs sm:text-sm text-warmgray dark:text-warmgray-light">
            You can set an exact date for a live countdown, or leave it undecided while exploring venues.
          </p>
        </div>

        <div class="space-y-4">
          <div class="flex items-center gap-3">
            <input 
              id="date-decided"
              v-model="draft.isDateDecided"
              type="checkbox" 
              class="w-4 h-4 rounded text-gold focus:ring-gold"
            />
            <label for="date-decided" class="text-sm font-medium text-charcoal dark:text-ivory">
              We have already chosen our primary wedding date
            </label>
          </div>

          <div v-if="draft.isDateDecided" class="space-y-1.5 max-w-sm">
            <label class="text-xs font-semibold uppercase tracking-wider text-warmgray">Primary Wedding Ceremony Date</label>
            <input 
              v-model="draft.weddingDate"
              type="date" 
              class="w-full px-4 py-3 rounded-xl bg-ivory dark:bg-charcoal-900 border border-champagne/60 dark:border-charcoal-light text-sm focus:outline-hidden focus:border-gold"
            />
          </div>

          <div v-else class="p-4 rounded-xl bg-champagne/20 border border-gold/30 text-xs text-warmgray-dark">
            No problem! EverAfter supports date-agnostic planning. You can set the date anytime from Settings.
          </div>
        </div>
      </div>

      <!-- STEP 3: Location -->
      <div v-else-if="currentStep === 3" class="space-y-6">
        <div class="space-y-1">
          <span class="text-xs font-semibold uppercase tracking-widest text-gold">Destination</span>
          <h2 class="text-2xl sm:text-3xl font-serif font-bold text-charcoal dark:text-ivory">
            Where will you celebrate?
          </h2>
          <p class="text-xs sm:text-sm text-warmgray dark:text-warmgray-light">
            Whether it’s a regal destination like Udaipur or an intimate hometown garden.
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="space-y-1.5">
            <label class="text-xs font-semibold uppercase tracking-wider text-warmgray">City *</label>
            <input 
              v-model="draft.city"
              type="text" 
              placeholder="e.g. Udaipur, Mumbai, Goa" 
              class="w-full px-4 py-3 rounded-xl bg-ivory dark:bg-charcoal-900 border border-champagne/60 dark:border-charcoal-light text-sm focus:outline-hidden focus:border-gold"
            />
          </div>

          <div class="space-y-1.5">
            <label class="text-xs font-semibold uppercase tracking-wider text-warmgray">State / Province</label>
            <input 
              v-model="draft.state"
              type="text" 
              placeholder="e.g. Rajasthan" 
              class="w-full px-4 py-3 rounded-xl bg-ivory dark:bg-charcoal-900 border border-champagne/60 dark:border-charcoal-light text-sm focus:outline-hidden focus:border-gold"
            />
          </div>

          <div class="space-y-1.5">
            <label class="text-xs font-semibold uppercase tracking-wider text-warmgray">Country</label>
            <input 
              v-model="draft.country"
              type="text" 
              placeholder="e.g. India" 
              class="w-full px-4 py-3 rounded-xl bg-ivory dark:bg-charcoal-900 border border-champagne/60 dark:border-charcoal-light text-sm focus:outline-hidden focus:border-gold"
            />
          </div>
        </div>
      </div>

      <!-- STEP 4: Budget -->
      <div v-else-if="currentStep === 4" class="space-y-6">
        <div class="space-y-1">
          <span class="text-xs font-semibold uppercase tracking-widest text-gold">Financial Plan</span>
          <h2 class="text-2xl sm:text-3xl font-serif font-bold text-charcoal dark:text-ivory">
            What is your estimated master budget?
          </h2>
          <p class="text-xs sm:text-sm text-warmgray dark:text-warmgray-light">
            We will automatically split this across venue, catering, decor, and photography.
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="space-y-1.5">
            <label class="text-xs font-semibold uppercase tracking-wider text-warmgray">Currency</label>
            <select 
              v-model="draft.currency"
              class="w-full px-4 py-3 rounded-xl bg-ivory dark:bg-charcoal-900 border border-champagne/60 dark:border-charcoal-light text-sm focus:outline-hidden focus:border-gold"
            >
              <option v-for="c in CURRENCIES" :key="c.code" :value="c.code">
                {{ c.code }} ({{ c.symbol }}) - {{ c.name }}
              </option>
            </select>
          </div>

          <div class="sm:col-span-2 space-y-1.5">
            <label class="text-xs font-semibold uppercase tracking-wider text-warmgray">Estimated Total Budget *</label>
            <input 
              v-model.number="draft.budget"
              type="number" 
              step="50000"
              placeholder="e.g. 6500000" 
              class="w-full px-4 py-3 rounded-xl bg-ivory dark:bg-charcoal-900 border border-champagne/60 dark:border-charcoal-light text-sm focus:outline-hidden focus:border-gold font-mono"
            />
          </div>
        </div>

        <div class="p-4 rounded-xl bg-ivory dark:bg-charcoal-900 border border-champagne/40 flex items-center justify-between text-xs">
          <span class="text-warmgray">Formatted Budget:</span>
          <span class="font-serif font-bold text-lg text-gold-dark dark:text-gold-light">
            {{ formatCurrency(draft.budget, draft.currency) }}
          </span>
        </div>
      </div>

      <!-- STEP 5: Guest Estimate -->
      <div v-else-if="currentStep === 5" class="space-y-6">
        <div class="space-y-1">
          <span class="text-xs font-semibold uppercase tracking-widest text-gold">Hospitality</span>
          <h2 class="text-2xl sm:text-3xl font-serif font-bold text-charcoal dark:text-ivory">
            How many guests are you expecting?
          </h2>
          <p class="text-xs sm:text-sm text-warmgray dark:text-warmgray-light">
            Helps calculate catering portions, room blocks, and table allocations.
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="space-y-1.5">
            <label class="text-xs font-semibold uppercase tracking-wider text-warmgray">Total Headcount *</label>
            <input 
              v-model.number="draft.guestCount"
              type="number" 
              placeholder="e.g. 320" 
              class="w-full px-4 py-3 rounded-xl bg-ivory dark:bg-charcoal-900 border border-champagne/60 dark:border-charcoal-light text-sm focus:outline-hidden focus:border-gold"
            />
          </div>

          <div class="space-y-1.5">
            <label class="text-xs font-semibold uppercase tracking-wider text-warmgray">{{ draft.partner1Name || 'Partner 1' }}'s Side</label>
            <input 
              v-model.number="draft.partner1GuestCount"
              type="number" 
              placeholder="e.g. 160" 
              class="w-full px-4 py-3 rounded-xl bg-ivory dark:bg-charcoal-900 border border-champagne/60 dark:border-charcoal-light text-sm focus:outline-hidden focus:border-gold"
            />
          </div>

          <div class="space-y-1.5">
            <label class="text-xs font-semibold uppercase tracking-wider text-warmgray">{{ draft.partner2Name || 'Partner 2' }}'s Side</label>
            <input 
              v-model.number="draft.partner2GuestCount"
              type="number" 
              placeholder="e.g. 160" 
              class="w-full px-4 py-3 rounded-xl bg-ivory dark:bg-charcoal-900 border border-champagne/60 dark:border-charcoal-light text-sm focus:outline-hidden focus:border-gold"
            />
          </div>
        </div>
      </div>

      <!-- STEP 6: Celebration Style -->
      <div v-else-if="currentStep === 6" class="space-y-6">
        <div class="space-y-1">
          <span class="text-xs font-semibold uppercase tracking-widest text-gold">Aesthetic Theme</span>
          <h2 class="text-2xl sm:text-3xl font-serif font-bold text-charcoal dark:text-ivory">
            Choose your celebration style
          </h2>
          <p class="text-xs sm:text-sm text-warmgray dark:text-warmgray-light">
            This guides your default moodboard aesthetic and decor shortlists.
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div 
            v-for="style in CELEBRATION_STYLES"
            :key="style.id"
            @click="draft.celebrationStyle = style.name"
            class="p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3"
            :class="draft.celebrationStyle === style.name 
              ? 'border-gold bg-champagne/20 dark:bg-charcoal-light shadow-xs' 
              : 'border-champagne/40 dark:border-charcoal-light/40 hover:border-gold/40'"
          >
            <div 
              class="w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5"
              :class="draft.celebrationStyle === style.name ? 'border-gold bg-gold text-white' : 'border-warmgray'"
            >
              <CheckCircle v-if="draft.celebrationStyle === style.name" class="w-3.5 h-3.5" />
            </div>
            <div>
              <div class="font-serif font-bold text-sm text-charcoal dark:text-ivory">{{ style.name }}</div>
              <div class="text-[11px] text-warmgray dark:text-warmgray-light mt-0.5">{{ style.desc }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- STEP 7: Functions & Traditions -->
      <div v-else-if="currentStep === 7" class="space-y-6">
        <div class="space-y-1">
          <span class="text-xs font-semibold uppercase tracking-widest text-gold">Celebration Events</span>
          <h2 class="text-2xl sm:text-3xl font-serif font-bold text-charcoal dark:text-ivory">
            Which ceremonies are you planning?
          </h2>
          <p class="text-xs sm:text-sm text-warmgray dark:text-warmgray-light">
            Select standard cultural traditions or add custom events.
          </p>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div 
            v-for="trad in WEDDING_TRADITIONS"
            :key="trad.id"
            @click="toggleTradition(trad.id)"
            class="p-3.5 rounded-xl border text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-1.5"
            :class="draft.selectedTraditionIds.includes(trad.id)
              ? 'border-gold bg-champagne/20 dark:bg-charcoal-light text-gold-dark dark:text-gold-light font-bold'
              : 'border-champagne/40 dark:border-charcoal-light/40 text-warmgray hover:border-gold/40'"
          >
            <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: trad.color }"></div>
            <span class="text-xs font-serif">{{ trad.name }}</span>
          </div>
        </div>

        <!-- Add Custom Function -->
        <div class="pt-4 border-t border-champagne/30 dark:border-charcoal-light/30 space-y-3">
          <span class="text-xs font-semibold uppercase tracking-wider text-warmgray">Add Custom Function</span>
          <div class="flex flex-col sm:flex-row gap-2">
            <input 
              v-model="customFunctionName"
              type="text" 
              placeholder="e.g. Sufi Night, Yacht Brunch" 
              class="flex-1 px-4 py-2.5 rounded-xl bg-ivory dark:bg-charcoal-900 border border-champagne/60 text-xs"
            />
            <input 
              v-model="customFunctionDate"
              type="date" 
              class="px-4 py-2.5 rounded-xl bg-ivory dark:bg-charcoal-900 border border-champagne/60 text-xs"
            />
            <button 
              type="button" 
              @click="addCustomFunction"
              class="px-4 py-2.5 rounded-xl bg-gold text-white text-xs font-semibold flex items-center justify-center gap-1"
            >
              <Plus class="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>

          <div v-if="draft.customFunctions.length" class="flex flex-wrap gap-2 pt-2">
            <div 
              v-for="(cf, idx) in draft.customFunctions" 
              :key="idx"
              class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-ivory dark:bg-charcoal-light border border-champagne text-xs"
            >
              <span>{{ cf.name }}</span>
              <button type="button" @click="removeCustomFunction(idx)" class="text-rose-dark hover:text-rose">
                <Trash2 class="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- STEP 8: Confirmation & Summary -->
      <div v-else-if="currentStep === 8" class="space-y-6">
        <div class="text-center space-y-2">
          <div class="w-14 h-14 mx-auto rounded-full bg-gold/20 flex items-center justify-center text-gold">
            <Sparkles class="w-7 h-7" />
          </div>
          <h2 class="text-2xl sm:text-3xl font-serif font-bold text-charcoal dark:text-ivory">
            Your Wedding Architecture is Ready!
          </h2>
          <p class="text-xs sm:text-sm text-warmgray dark:text-warmgray-light">
            Review your plan summary below and click "Launch Workspace" to begin organizing your celebration.
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 p-6 rounded-2xl bg-ivory dark:bg-charcoal-900 border border-champagne/40 dark:border-charcoal-light text-xs">
          <div>
            <span class="text-warmgray block">Couple:</span>
            <span class="font-serif font-bold text-base text-charcoal dark:text-ivory">
              {{ draft.partner1Name }} &amp; {{ draft.partner2Name }}
            </span>
          </div>
          <div>
            <span class="text-warmgray block">Ceremony Date:</span>
            <span class="font-bold text-charcoal dark:text-ivory">
              {{ draft.isDateDecided ? draft.weddingDate : 'To be decided' }}
            </span>
          </div>
          <div>
            <span class="text-warmgray block">Location:</span>
            <span class="font-bold text-charcoal dark:text-ivory">
              {{ draft.city }}, {{ draft.country }}
            </span>
          </div>
          <div>
            <span class="text-warmgray block">Budget Allocation:</span>
            <span class="font-bold text-gold-dark dark:text-gold-light">
              {{ formatCurrency(draft.budget, draft.currency) }}
            </span>
          </div>
          <div>
            <span class="text-warmgray block">Expected Guests:</span>
            <span class="font-bold text-charcoal dark:text-ivory">
              {{ draft.guestCount }} Guests
            </span>
          </div>
          <div>
            <span class="text-warmgray block">Aesthetic Style:</span>
            <span class="font-bold text-charcoal dark:text-ivory">
              {{ draft.celebrationStyle }}
            </span>
          </div>
        </div>
      </div>

      <!-- Navigation Footer Controls -->
      <div class="pt-8 mt-8 border-t border-champagne/30 dark:border-charcoal-light/30 flex items-center justify-between">
        <button 
          v-if="currentStep > 1"
          type="button" 
          @click="prevStep"
          class="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold text-warmgray hover:text-charcoal dark:hover:text-white transition-colors"
        >
          <ArrowLeft class="w-4 h-4" />
          <span>Back</span>
        </button>
        <div v-else></div>

        <button 
          type="button" 
          @click="nextStep"
          :disabled="!isStepValid"
          class="inline-flex items-center gap-2 px-7 py-3 rounded-full text-xs font-semibold uppercase tracking-wider bg-gold hover:bg-gold-dark disabled:opacity-50 text-white shadow-soft transition-all"
        >
          <span>{{ currentStep === totalSteps ? 'Launch Workspace' : 'Continue' }}</span>
          <ArrowRight class="w-4 h-4" />
        </button>
      </div>

    </div>
  </div>
</template>
