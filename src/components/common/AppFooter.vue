<script setup lang="ts">
import { BRAND } from '@/config/constants'
import AppLogo from './AppLogo.vue'

withDefaults(defineProps<{
  compact?: boolean
}>(), {
  compact: false
})
</script>

<template>
  <footer 
    class="w-full transition-colors border-t border-champagne/40 dark:border-charcoal-light/40 bg-ivory-light dark:bg-charcoal-950 text-charcoal dark:text-ivory"
    :class="compact ? 'py-6 px-4 md:px-8' : 'pt-16 pb-12 px-6 md:px-12'"
  >
    <div class="max-w-7xl mx-auto">
      <div v-if="!compact" class="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-champagne/30 dark:border-charcoal-light/30">
        <!-- Col 1: Brand Info -->
        <div class="space-y-4 md:col-span-1">
          <AppLogo size="md" />
          <p class="text-sm text-warmgray dark:text-warmgray-light leading-relaxed">
            {{ BRAND.tagline }}
          </p>
          <p class="text-xs text-warmgray/80 dark:text-warmgray-light/80 italic">
            {{ BRAND.demoNotice }}
          </p>
        </div>

        <!-- Col 2: Planning Hub -->
        <div class="space-y-3">
          <h4 class="text-xs font-semibold uppercase tracking-widest text-gold dark:text-gold-light">Planning Suite</h4>
          <ul class="space-y-2 text-sm text-warmgray dark:text-warmgray-light">
            <li><router-link to="/budget" class="hover:text-gold transition-colors">Budget Planner</router-link></li>
            <li><router-link to="/checklist" class="hover:text-gold transition-colors">Interactive Checklist</router-link></li>
            <li><router-link to="/guests" class="hover:text-gold transition-colors">Guest List & RSVP</router-link></li>
            <li><router-link to="/seating" class="hover:text-gold transition-colors">Seating Studio</router-link></li>
            <li><router-link to="/timeline" class="hover:text-gold transition-colors">Wedding Timeline</router-link></li>
          </ul>
        </div>

        <!-- Col 3: Discovery & Design -->
        <div class="space-y-3">
          <h4 class="text-xs font-semibold uppercase tracking-widest text-gold dark:text-gold-light">Discovery & Design</h4>
          <ul class="space-y-2 text-sm text-warmgray dark:text-warmgray-light">
            <li><router-link to="/venues" class="hover:text-gold transition-colors">Heritage Venues</router-link></li>
            <li><router-link to="/vendors" class="hover:text-gold transition-colors">Curated Vendors</router-link></li>
            <li><router-link to="/moodboard" class="hover:text-gold transition-colors">Inspiration Studio</router-link></li>
            <li><router-link to="/invitations" class="hover:text-gold transition-colors">Digital Invitations</router-link></li>
            <li><router-link to="/wedding-website" class="hover:text-gold transition-colors">Wedding Microsite</router-link></li>
          </ul>
        </div>

        <!-- Col 4: Platform -->
        <div class="space-y-3">
          <h4 class="text-xs font-semibold uppercase tracking-widest text-gold dark:text-gold-light">Workspace</h4>
          <ul class="space-y-2 text-sm text-warmgray dark:text-warmgray-light">
            <li><router-link to="/dashboard" class="hover:text-gold transition-colors">Couple Dashboard</router-link></li>
            <li><router-link to="/collaboration" class="hover:text-gold transition-colors">Family Collaboration</router-link></li>
            <li><router-link to="/reports" class="hover:text-gold transition-colors">Reports & Analytics</router-link></li>
            <li><router-link to="/settings" class="hover:text-gold transition-colors">Settings & Backup</router-link></li>
            <li><router-link to="/start-planning" class="hover:text-gold transition-colors">Onboarding Wizard</router-link></li>
          </ul>
        </div>
      </div>

      <!-- Bottom Bar with Mandatory Credits -->
      <div 
        class="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-warmgray dark:text-warmgray-light"
        :class="{ 'pt-8': !compact }"
      >
        <div class="flex items-center gap-2">
          <span>{{ BRAND.copyright }}</span>
          <span class="inline-block w-1.5 h-1.5 rounded-full bg-champagne-dark dark:bg-charcoal-light"></span>
          <span class="text-warmgray/80 dark:text-warmgray-light/80">Premium Demo Experience</span>
        </div>

        <div class="flex items-center gap-1 font-medium">
          <span>Designed &amp; Developed by</span>
          <a 
            :href="BRAND.creatorUrl" 
            target="_blank" 
            rel="noopener noreferrer"
            class="text-gold hover:text-gold-dark dark:text-gold-light dark:hover:text-gold underline underline-offset-4 font-semibold transition-colors"
          >
            Infinvo Tech
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>
