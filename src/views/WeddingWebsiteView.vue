<script setup lang="ts">
import { ref } from 'vue'
import {
  Globe,
  Eye,
  Check,
  Copy,
  Printer,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  Edit2,
  Calendar,
  MapPin,
  Heart,
  ChevronDown
} from 'lucide-vue-next'
import { useWebsiteStore } from '@/stores/website'
import { useWorkspaceStore } from '@/stores/workspace'
import { useTimelineStore } from '@/stores/timeline'
import { formatDate } from '@/utils/date'

const websiteStore = useWebsiteStore()
const workspaceStore = useWorkspaceStore()
const timelineStore = useTimelineStore()

const isLivePreviewActive = ref(true)
const isCopied = ref(false)

const themes = ['Elegant', 'Minimal', 'Floral'] as const

function copySiteUrl() {
  const url = `${window.location.origin}/#preview-site`
  navigator.clipboard.writeText(url)
  isCopied.value = true
  setTimeout(() => { isCopied.value = false }, 3000)
}
</script>

<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
      <div>
        <h1 class="text-3xl font-serif font-bold text-charcoal dark:text-ivory">Wedding Website Builder</h1>
        <p class="text-xs text-warmgray">Design your guest-facing wedding microsite with interactive story, schedule, and RSVP portal</p>
      </div>

      <div class="flex items-center gap-3">
        <button 
          type="button" 
          @click="copySiteUrl"
          class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white dark:bg-charcoal border border-champagne/60 text-xs font-semibold text-charcoal dark:text-ivory shadow-xs hover:border-gold transition-colors"
        >
          <Check v-if="isCopied" class="w-3.5 h-3.5 text-emerald-500" />
          <Copy v-else class="w-3.5 h-3.5 text-gold" />
          <span>{{ isCopied ? 'URL Copied!' : 'Copy Demo Link' }}</span>
        </button>

        <button 
          type="button" 
          @click="isLivePreviewActive = !isLivePreviewActive"
          class="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gold hover:bg-gold-dark text-white text-xs font-semibold shadow-soft transition-colors"
        >
          <Eye class="w-4 h-4" />
          <span>{{ isLivePreviewActive ? 'Hide Live Preview' : 'Show Live Preview' }}</span>
        </button>
      </div>
    </div>

    <!-- Theme & Section Toggle Bar -->
    <div class="p-6 rounded-3xl bg-white dark:bg-charcoal border border-champagne/40 dark:border-charcoal-light shadow-soft space-y-4 no-print">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span class="text-xs font-semibold uppercase tracking-wider text-gold">Microsite Aesthetic</span>
          <h3 class="font-serif text-lg font-bold text-charcoal dark:text-ivory">Theme Selection</h3>
        </div>

        <div class="flex items-center gap-2">
          <button 
            v-for="th in themes"
            :key="th"
            type="button" 
            @click="websiteStore.updateConfig({ theme: th })"
            class="px-4 py-2 rounded-xl text-xs font-semibold transition-all"
            :class="websiteStore.config.theme === th 
              ? 'bg-gold text-white shadow-xs' 
              : 'bg-ivory dark:bg-charcoal-900 text-warmgray border border-champagne/40 hover:border-gold'"
          >
            {{ th }} Theme
          </button>
        </div>
      </div>

      <!-- Sections Visibility Toggles -->
      <div class="pt-4 border-t border-champagne/20 dark:border-charcoal-light/20">
        <span class="text-xs font-semibold uppercase tracking-wider text-warmgray block mb-2">Toggle Page Sections</span>
        <div class="flex flex-wrap gap-2">
          <button 
            v-for="sec in websiteStore.config.sections"
            :key="sec.id"
            type="button" 
            @click="websiteStore.toggleSection(sec.id)"
            class="px-3.5 py-1.5 rounded-full text-xs font-medium border flex items-center gap-1.5 transition-colors"
            :class="sec.enabled 
              ? 'border-gold bg-champagne/20 text-gold-dark dark:text-gold-light' 
              : 'border-champagne/30 text-warmgray opacity-60'"
          >
            <Check v-if="sec.enabled" class="w-3 h-3 text-gold" />
            <span>{{ sec.name }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Live Preview Frame -->
    <div 
      v-if="isLivePreviewActive" 
      class="rounded-3xl border-4 border-champagne dark:border-charcoal-light overflow-hidden bg-ivory dark:bg-charcoal-950 shadow-2xl transition-all"
    >
      <!-- Browser Mockup Header -->
      <div class="bg-charcoal text-ivory px-6 py-3 flex items-center justify-between text-xs border-b border-charcoal-light">
        <div class="flex items-center gap-2">
          <span class="w-3 h-3 rounded-full bg-rose"></span>
          <span class="w-3 h-3 rounded-full bg-amber-400"></span>
          <span class="w-3 h-3 rounded-full bg-emerald-400"></span>
          <span class="font-mono text-warmgray ml-2 text-[11px]">https://everafter.wedding/{{ websiteStore.config.customSlug }}</span>
        </div>
        <span class="text-[10px] uppercase font-bold text-gold bg-charcoal-light px-2.5 py-0.5 rounded-full">
          Live Guest Preview
        </span>
      </div>

      <!-- Website Content -->
      <div class="space-y-16 pb-16">
        <!-- Hero Section -->
        <section 
          v-if="websiteStore.config.sections.find(s => s.id === 'sec-hero')?.enabled"
          class="relative h-[480px] flex items-center justify-center text-center text-white px-4"
        >
          <img :src="websiteStore.config.heroImage" class="absolute inset-0 w-full h-full object-cover" />
          <div class="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/40 to-charcoal/30"></div>
          
          <div class="relative z-10 max-w-2xl mx-auto space-y-4">
            <span class="text-xs uppercase tracking-[0.3em] font-semibold text-champagne">
              We Invite You to Celebrate
            </span>
            <h1 class="font-serif text-5xl sm:text-6xl font-bold tracking-tight">
              {{ websiteStore.config.heroTitle }}
            </h1>
            <p class="text-sm sm:text-base font-light text-champagne/90">
              {{ websiteStore.config.heroSubtitle }}
            </p>
            <div class="pt-4">
              <router-link 
                to="/rsvp/EA-9001" 
                target="_blank"
                class="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-gold hover:bg-gold-dark text-white text-xs font-semibold uppercase tracking-wider shadow-luxury transition-all"
              >
                <span>RSVP to Ceremony</span>
                <Heart class="w-3.5 h-3.5 fill-white" />
              </router-link>
            </div>
          </div>
        </section>

        <!-- Our Story Section -->
        <section 
          v-if="websiteStore.config.sections.find(s => s.id === 'sec-story')?.enabled"
          class="max-w-4xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
        >
          <div class="rounded-3xl overflow-hidden shadow-luxury">
            <img :src="websiteStore.config.storyImage" class="w-full h-80 object-cover" />
          </div>
          <div class="space-y-3">
            <span class="text-xs font-semibold uppercase tracking-widest text-gold">The Journey</span>
            <h2 class="font-serif text-3xl font-bold text-charcoal dark:text-ivory">{{ websiteStore.config.storyTitle }}</h2>
            <p class="text-xs sm:text-sm text-warmgray dark:text-warmgray-light leading-relaxed">
              {{ websiteStore.config.storyText }}
            </p>
          </div>
        </section>

        <!-- Schedule Section -->
        <section 
          v-if="websiteStore.config.sections.find(s => s.id === 'sec-schedule')?.enabled"
          class="max-w-4xl mx-auto px-6 space-y-8"
        >
          <div class="text-center space-y-2">
            <span class="text-xs font-semibold uppercase tracking-widest text-gold">Celebration Itinerary</span>
            <h2 class="font-serif text-3xl font-bold text-charcoal dark:text-ivory">Events &amp; Functions</h2>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div 
              v-for="evt in timelineStore.sortedEvents" 
              :key="evt.id"
              class="p-6 rounded-2xl bg-white dark:bg-charcoal border border-champagne/40 dark:border-charcoal-light shadow-soft space-y-2"
            >
              <div class="flex items-center justify-between text-xs">
                <span class="font-mono font-bold text-gold">{{ formatDate(evt.date) }}</span>
                <span class="text-warmgray">{{ evt.startTime }} - {{ evt.endTime }}</span>
              </div>
              <h4 class="font-serif font-bold text-lg text-charcoal dark:text-ivory">{{ evt.name }}</h4>
              <p class="text-xs text-warmgray">{{ evt.venue }}</p>
              <div v-if="evt.dressCode" class="text-[11px] text-warmgray-dark pt-1">
                <span class="font-semibold text-gold">Dress Code:</span> {{ evt.dressCode }}
              </div>
            </div>
          </div>
        </section>

        <!-- Venue & Travel Section -->
        <section 
          v-if="websiteStore.config.sections.find(s => s.id === 'sec-venue')?.enabled"
          class="max-w-4xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
        >
          <div class="space-y-3">
            <span class="text-xs font-semibold uppercase tracking-widest text-gold">Accommodations</span>
            <h2 class="font-serif text-3xl font-bold text-charcoal dark:text-ivory">{{ websiteStore.config.venueTitle }}</h2>
            <p class="text-xs sm:text-sm text-warmgray dark:text-warmgray-light leading-relaxed">
              {{ websiteStore.config.venueDetails }}
            </p>
          </div>
          <div class="rounded-3xl overflow-hidden shadow-luxury">
            <img :src="websiteStore.config.venueImage" class="w-full h-72 object-cover" />
          </div>
        </section>

        <!-- Guest FAQs -->
        <section 
          v-if="websiteStore.config.sections.find(s => s.id === 'sec-faq')?.enabled"
          class="max-w-3xl mx-auto px-6 space-y-6"
        >
          <div class="text-center space-y-2">
            <span class="text-xs font-semibold uppercase tracking-widest text-gold">Guest Information</span>
            <h2 class="font-serif text-3xl font-bold text-charcoal dark:text-ivory">Frequently Asked Questions</h2>
          </div>

          <div class="space-y-3">
            <div 
              v-for="faq in websiteStore.config.faqs" 
              :key="faq.question"
              class="p-5 rounded-2xl bg-white dark:bg-charcoal border border-champagne/40 dark:border-charcoal-light shadow-soft space-y-1.5"
            >
              <h4 class="font-serif font-bold text-base text-charcoal dark:text-ivory">{{ faq.question }}</h4>
              <p class="text-xs text-warmgray dark:text-warmgray-light leading-relaxed">{{ faq.answer }}</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>
