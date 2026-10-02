<script setup lang="ts">
import { Sparkles } from 'lucide-vue-next'

defineProps<{
  title: string
  description?: string
  actionLabel?: string
}>()

const emit = defineEmits<{
  (e: 'action'): void
}>()
</script>

<template>
  <div class="flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl border border-dashed border-champagne/60 dark:border-charcoal-light/60 bg-ivory/30 dark:bg-charcoal/30">
    <div class="w-12 h-12 rounded-2xl bg-champagne/30 dark:bg-charcoal-light/40 flex items-center justify-center text-gold mb-3">
      <Sparkles class="w-6 h-6" />
    </div>
    <h4 class="font-serif text-lg font-semibold text-charcoal dark:text-ivory">
      {{ title }}
    </h4>
    <p v-if="description" class="text-sm text-warmgray dark:text-warmgray-light max-w-sm mt-1 mb-4 leading-relaxed">
      {{ description }}
    </p>
    <button 
      v-if="actionLabel" 
      type="button" 
      @click="emit('action')"
      class="px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider bg-gold hover:bg-gold-dark text-white transition-all shadow-sm"
    >
      {{ actionLabel }}
    </button>
  </div>
</template>
