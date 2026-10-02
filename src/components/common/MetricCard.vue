<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  title: string
  value: string | number
  subtitle?: string
  trend?: string
  trendType?: 'positive' | 'neutral' | 'warning' | 'alert'
  iconName?: string
}>()

const trendClasses = computed(() => {
  switch (props.trendType) {
    case 'positive':
      return 'bg-sage/15 text-sage-dark dark:text-sage-light border-sage/30'
    case 'warning':
      return 'bg-champagne/40 text-gold-dark dark:text-gold-light border-gold/30'
    case 'alert':
      return 'bg-rose/20 text-rose-dark dark:text-rose-light border-rose/30'
    default:
      return 'bg-warmgray/10 text-warmgray dark:text-warmgray-light border-warmgray/20'
  }
})
</script>

<template>
  <div class="relative overflow-hidden rounded-2xl bg-white dark:bg-charcoal p-5 sm:p-6 shadow-soft border border-champagne/40 dark:border-charcoal-light/50 transition-all duration-300 hover:shadow-luxury hover:border-gold/30">
    <div class="flex items-start justify-between gap-3">
      <div class="space-y-1 min-w-0">
        <span class="text-xs font-medium uppercase tracking-wider text-warmgray dark:text-warmgray-light">
          {{ title }}
        </span>
        <div class="text-2xl sm:text-3xl font-serif font-bold text-charcoal dark:text-ivory truncate">
          {{ value }}
        </div>
      </div>
      <div 
        v-if="trend" 
        class="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border"
        :class="trendClasses"
      >
        {{ trend }}
      </div>
    </div>
    
    <div v-if="subtitle" class="mt-3 flex items-center gap-1.5 text-xs text-warmgray dark:text-warmgray-light">
      <span>{{ subtitle }}</span>
    </div>

    <!-- Decorative subtle gold corner shimmer -->
    <div class="absolute -right-6 -bottom-6 w-16 h-16 rounded-full bg-champagne/20 dark:bg-gold/5 blur-xl pointer-events-none"></div>
  </div>
</template>
