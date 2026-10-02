<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  CheckCircle,
  XCircle,
  Sparkles,
  Calendar,
  MapPin,
  Send,
  AlertCircle,
  ArrowRight,
  Heart
} from 'lucide-vue-next'
import confetti from 'canvas-confetti'
import { useGuestStore } from '@/stores/guests'
import { useWorkspaceStore } from '@/stores/workspace'
import { formatDate } from '@/utils/date'
import AppLogo from '@/components/common/AppLogo.vue'
import type { Guest, RSVPStatus, MealPreference } from '@/types'

const route = useRoute()
const router = useRouter()
const guestStore = useGuestStore()
const workspaceStore = useWorkspaceStore()

const rsvpCode = ref<string>((route.params.code as string) || '')
const currentGuest = ref<Guest | null>(null)
const isInvalidCode = ref(false)
const isSubmitted = ref(false)

const rsvpStatus = ref<RSVPStatus>('Accepted')
const accompanyingGuests = ref<number>(0)
const mealPreference = ref<MealPreference>('Vegetarian')
const guestMessage = ref('')

onMounted(() => {
  if (rsvpCode.value) {
    const found = guestStore.findGuestByCode(rsvpCode.value)
    if (found) {
      currentGuest.value = found
      rsvpStatus.value = found.rsvpStatus === 'Pending' ? 'Accepted' : found.rsvpStatus
      accompanyingGuests.value = found.accompanyingGuests || 0
      mealPreference.value = found.mealPreference || 'Vegetarian'
    } else {
      isInvalidCode.value = true
    }
  } else {
    isInvalidCode.value = true
  }
})

function submitRsvp() {
  if (!currentGuest.value) return

  const success = guestStore.submitRsvpResponse(
    currentGuest.value.code,
    rsvpStatus.value,
    accompanyingGuests.value,
    mealPreference.value,
    guestMessage.value
  )

  if (success) {
    isSubmitted.value = true
    if (rsvpStatus.value === 'Accepted') {
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        })
      } catch {}
    }
  }
}
</script>

<template>
  <div class="min-h-screen bg-ivory dark:bg-charcoal-950 py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-between text-charcoal dark:text-ivory selection:bg-gold selection:text-white">
    <!-- Top Branding -->
    <div class="max-w-xl mx-auto w-full text-center space-y-4 mb-8">
      <router-link to="/">
        <AppLogo size="md" />
      </router-link>
      <div class="text-xs uppercase tracking-widest text-gold font-semibold">
        Official Wedding RSVP Portal
      </div>
    </div>

    <!-- Main Container -->
    <div class="max-w-xl mx-auto w-full bg-white dark:bg-charcoal rounded-3xl p-6 sm:p-10 shadow-2xl border border-champagne/50 dark:border-charcoal-light">
      
      <!-- INVALID DEMO CODE STATE -->
      <div v-if="isInvalidCode" class="text-center space-y-4 py-8">
        <div class="w-14 h-14 mx-auto rounded-full bg-rose/20 text-rose-dark flex items-center justify-center">
          <AlertCircle class="w-7 h-7" />
        </div>
        <h2 class="font-serif text-2xl font-bold text-charcoal dark:text-ivory">
          Invitation Code Not Found
        </h2>
        <p class="text-xs sm:text-sm text-warmgray max-w-sm mx-auto leading-relaxed">
          We could not locate a guest record for code "<strong>{{ rsvpCode }}</strong>". Please verify your personal invitation card or try one of our demo codes like <strong>EA-9001</strong>.
        </p>
        <div class="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <router-link 
            to="/rsvp/EA-9001" 
            class="px-5 py-2.5 rounded-full bg-gold text-white text-xs font-semibold uppercase tracking-wider"
          >
            Try Demo Code: EA-9001
          </router-link>
          <router-link 
            to="/dashboard" 
            class="px-5 py-2.5 rounded-full bg-ivory dark:bg-charcoal-900 text-charcoal dark:text-ivory text-xs font-semibold"
          >
            Open Planner Dashboard
          </router-link>
        </div>
      </div>

      <!-- SUCCESS CONFIRMATION STATE -->
      <div v-else-if="isSubmitted" class="text-center space-y-5 py-6">
        <div class="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
          <CheckCircle class="w-8 h-8" />
        </div>
        <div class="space-y-1">
          <span class="text-xs uppercase tracking-widest text-gold font-semibold">Response Recorded</span>
          <h2 class="font-serif text-3xl font-bold text-charcoal dark:text-ivory">
            {{ rsvpStatus === 'Accepted' ? 'We Can’t Wait to Celebrate!' : 'Thank You for Letting Us Know' }}
          </h2>
          <p class="text-xs sm:text-sm text-warmgray max-w-sm mx-auto">
            Your RSVP has been securely updated in the EverAfter wedding workspace.
          </p>
        </div>

        <div class="p-5 rounded-2xl bg-ivory dark:bg-charcoal-900 border border-champagne/40 text-xs text-left space-y-2">
          <div class="flex justify-between">
            <span class="text-warmgray">Guest:</span>
            <span class="font-bold text-charcoal dark:text-ivory">{{ currentGuest?.fullName }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-warmgray">Status:</span>
            <span class="font-bold" :class="rsvpStatus === 'Accepted' ? 'text-emerald-600' : 'text-rose-dark'">
              {{ rsvpStatus }}
            </span>
          </div>
          <div v-if="rsvpStatus === 'Accepted'" class="flex justify-between">
            <span class="text-warmgray">Total Attendees:</span>
            <span class="font-bold text-charcoal dark:text-ivory">{{ 1 + accompanyingGuests }} Guests</span>
          </div>
          <div v-if="rsvpStatus === 'Accepted'" class="flex justify-between">
            <span class="text-warmgray">Meal Preference:</span>
            <span class="font-bold text-charcoal dark:text-ivory">{{ mealPreference }}</span>
          </div>
        </div>

        <div class="pt-4 flex justify-center gap-3">
          <router-link 
            to="/dashboard"
            class="px-6 py-2.5 rounded-full bg-gold hover:bg-gold-dark text-white text-xs font-semibold uppercase tracking-wider"
          >
            Return to Dashboard
          </router-link>
        </div>
      </div>

      <!-- ACTIVE RSVP FORM -->
      <div v-else-if="currentGuest" class="space-y-6">
        <!-- Event Context -->
        <div class="text-center space-y-2 pb-6 border-b border-champagne/40 dark:border-charcoal-light">
          <span class="text-xs uppercase font-semibold tracking-widest text-gold">You Are Cordially Invited</span>
          <h1 class="font-serif text-3xl font-bold text-charcoal dark:text-ivory">
            {{ workspaceStore.coupleNames }}
          </h1>
          <div class="flex flex-wrap items-center justify-center gap-3 text-xs text-warmgray">
            <span class="flex items-center gap-1"><Calendar class="w-3.5 h-3.5 text-gold" /> {{ formatDate(workspaceStore.weddingDate) }}</span>
            <span>•</span>
            <span class="flex items-center gap-1"><MapPin class="w-3.5 h-3.5 text-gold" /> {{ workspaceStore.locationDisplay }}</span>
          </div>
        </div>

        <!-- Personalized Greeting -->
        <div class="p-4 rounded-2xl bg-champagne/20 dark:bg-charcoal-900 border border-gold/30 text-xs">
          <div class="font-serif font-bold text-sm text-charcoal dark:text-ivory">
            Namaste, {{ currentGuest.fullName }}
          </div>
          <p class="text-warmgray mt-0.5">
            Please confirm your attendance below so our hospitality team can arrange your transfers and banquet seating.
          </p>
        </div>

        <!-- Form -->
        <form @submit.prevent="submitRsvp" class="space-y-5 text-xs">
          <!-- Attendance choice -->
          <div class="space-y-2">
            <label class="font-semibold text-warmgray uppercase">Will you be attending? *</label>
            <div class="grid grid-cols-2 gap-3">
              <label 
                class="p-3.5 rounded-2xl border cursor-pointer flex items-center justify-center gap-2 font-bold text-xs transition-all"
                :class="rsvpStatus === 'Accepted' ? 'border-emerald-500 bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200' : 'border-champagne/60 text-warmgray'"
              >
                <input type="radio" value="Accepted" v-model="rsvpStatus" class="hidden" />
                <CheckCircle class="w-4 h-4" />
                <span>Joyfully Accept</span>
              </label>

              <label 
                class="p-3.5 rounded-2xl border cursor-pointer flex items-center justify-center gap-2 font-bold text-xs transition-all"
                :class="rsvpStatus === 'Declined' ? 'border-rose bg-rose/15 text-rose-dark dark:text-rose-light' : 'border-champagne/60 text-warmgray'"
              >
                <input type="radio" value="Declined" v-model="rsvpStatus" class="hidden" />
                <XCircle class="w-4 h-4" />
                <span>Regretfully Decline</span>
              </label>
            </div>
          </div>

          <div v-if="rsvpStatus === 'Accepted'" class="space-y-4">
            <!-- Accompanying attendees -->
            <div class="space-y-1.5">
              <label class="font-semibold text-warmgray uppercase">Number of Accompanying Guests (Plus Ones)</label>
              <input 
                v-model.number="accompanyingGuests"
                type="number" 
                min="0" 
                max="8"
                class="w-full px-3.5 py-2.5 rounded-xl bg-ivory dark:bg-charcoal-900 border border-champagne/60 text-xs font-mono"
              />
              <span class="text-[10px] text-warmgray">Total attending with your party: {{ 1 + accompanyingGuests }}</span>
            </div>

            <!-- Meal preference -->
            <div class="space-y-1.5">
              <label class="font-semibold text-warmgray uppercase">Banquet Dining Preference</label>
              <select 
                v-model="mealPreference"
                class="w-full px-3.5 py-2.5 rounded-xl bg-ivory dark:bg-charcoal-900 border border-champagne/60 text-xs"
              >
                <option value="Vegetarian">Vegetarian Cuisine</option>
                <option value="Non-Vegetarian">Non-Vegetarian / Royal Awadhi</option>
                <option value="Vegan">Plant-Based / Vegan</option>
                <option value="Jain">Strictly Jain (No Onion, Garlic, Roots)</option>
                <option value="Halal">Halal</option>
                <option value="Gluten-Free">Gluten-Free</option>
              </select>
            </div>
          </div>

          <!-- Blessing / Message -->
          <div class="space-y-1.5">
            <label class="font-semibold text-warmgray uppercase">Message for the Couple (Optional)</label>
            <textarea 
              v-model="guestMessage"
              rows="3"
              placeholder="Warm wishes, dietary notes, or travel timings..."
              class="w-full px-3.5 py-2.5 rounded-xl bg-ivory dark:bg-charcoal-900 border border-champagne/60 text-xs"
            ></textarea>
          </div>

          <!-- Submit Button -->
          <div class="pt-2">
            <button 
              type="submit" 
              class="w-full py-3.5 rounded-full bg-gold hover:bg-gold-dark text-white font-semibold uppercase tracking-wider text-xs shadow-luxury transition-all flex items-center justify-center gap-2"
            >
              <span>Submit RSVP Confirmation</span>
              <Send class="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>

    </div>

    <!-- Footer Note -->
    <div class="text-center text-xs text-warmgray pt-6">
      <span>EverAfter Local Demo Preview • Responses are saved directly into your browser's workspace.</span>
    </div>
  </div>
</template>
