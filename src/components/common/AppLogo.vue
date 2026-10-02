<script setup lang="ts">
import { BRAND } from '@/config/constants'

withDefaults(defineProps<{
  size?: 'sm' | 'md' | 'lg'
  inverted?: boolean
}>(), {
  size: 'md',
  inverted: false
})
</script>

<template>
  <div class="inline-flex items-center gap-2.5 group select-none">
    <div 
      class="relative flex items-center justify-center transition-transform duration-300 group-hover:scale-105"
      :class="{
        'w-8 h-8': size === 'sm',
        'w-10 h-10': size === 'md',
        'w-12 h-12': size === 'lg'
      }"
    >
      <svg class="w-full h-full" viewBox="0 0 100 100" fill="none">
        <rect width="100" height="100" rx="22" :fill="inverted ? '#FAF7F2' : '#292725'" />
        <!-- Interlocking Rings -->
        <circle cx="41" cy="50" r="23" stroke="#B99A62" stroke-width="4.5" fill="none" opacity="0.9" />
        <circle cx="59" cy="50" r="23" stroke="#E8D8B9" stroke-width="4.5" fill="none" opacity="0.9" />
        <circle cx="50" cy="50" r="5" fill="#B99A62" />
      </svg>
    </div>
    <div class="flex flex-col">
      <span 
        class="font-serif tracking-tight font-semibold leading-none transition-colors"
        :class="{
          'text-lg': size === 'sm',
          'text-2xl': size === 'md',
          'text-3xl': size === 'lg',
          'text-white': inverted,
          'text-charcoal dark:text-ivory': !inverted
        }"
      >
        {{ BRAND.name }}
      </span>
      <span 
        v-if="size !== 'sm'"
        class="text-[10px] tracking-[0.2em] uppercase font-medium mt-1"
        :class="inverted ? 'text-champagne/80' : 'text-warmgray dark:text-warmgray-light'"
      >
        Celebrations
      </span>
    </div>
  </div>
</template>
