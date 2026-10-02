<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Monitor, X, ArrowRight, Laptop, Sparkles } from 'lucide-vue-next'

const isMobile = ref(false)
const isDismissed = ref(false)

function checkViewport() {
  const mobile = window.innerWidth < 1024
  isMobile.value = mobile

  // If user switches to desktop screen size (>= 1024px),
  // automatically disappear and reset dismissed state so it alerts them if they return to mobile mode
  if (!mobile) {
    isDismissed.value = false
  }
}

onMounted(() => {
  checkViewport()
  window.addEventListener('resize', checkViewport)
  window.addEventListener('orientationchange', checkViewport)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkViewport)
  window.removeEventListener('orientationchange', checkViewport)
})

function dismiss() {
  isDismissed.value = true
}
</script>

<template>
  <!-- Top Banner: Appears in mobile mode, disappears automatically on desktop -->
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="-translate-y-full opacity-0"
    enter-to-class="translate-y-0 opacity-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="translate-y-0 opacity-100"
    leave-to-class="-translate-y-full opacity-0"
  >
    <aside 
      v-if="isMobile && !isDismissed" 
      class="sticky top-0 z-50 w-full bg-[#FAF4EA] dark:bg-charcoal-950 bg-gradient-to-r from-[#FAF4EA] via-[#F4EBDB] to-[#FAF4EA] dark:from-charcoal-950 dark:via-charcoal-900 dark:to-charcoal-950 text-charcoal-900 dark:text-ivory border-b border-gold/50 dark:border-gold/40 shadow-md px-3.5 py-2.5 transition-all select-none backdrop-blur-md"
      role="banner"
      aria-label="Desktop recommendation notice"
    >
      <div class="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <!-- Icon & Message -->
        <div class="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
          <div class="w-8 h-8 rounded-xl bg-gold/15 dark:bg-gold/25 border border-gold/40 flex items-center justify-center text-gold-dark dark:text-gold shrink-0 shadow-xs">
            <Monitor class="w-4 h-4 animate-pulse" />
          </div>

          <div class="min-w-0 flex-1">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="font-serif font-bold text-xs sm:text-sm text-charcoal-900 dark:text-white tracking-wide">
                Best Experienced on Desktop
              </span>
              <span class="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-gold/25 dark:bg-gold/30 text-gold-dark dark:text-champagne border border-gold/40">
                Recommended
              </span>
            </div>
            <p class="text-[11px] text-charcoal/85 dark:text-champagne/90 leading-snug mt-0.5 line-clamp-2 sm:line-clamp-none font-medium">
              For full features like the Seating Studio, Calendar &amp; Budget, please open on a laptop or desktop.
            </p>
          </div>
        </div>

        <!-- Action / Dismiss Button -->
        <div class="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button 
            type="button" 
            @click="dismiss"
            class="px-2.5 py-1 rounded-lg text-[11px] font-semibold text-charcoal-900 dark:text-champagne/90 hover:text-charcoal bg-gold/20 hover:bg-gold/30 dark:bg-white/10 dark:hover:bg-white/15 border border-gold/30 dark:border-white/10 transition-colors hidden sm:inline-block shadow-xs"
          >
            Continue
          </button>
          <button 
            type="button" 
            @click="dismiss"
            class="p-1.5 rounded-lg text-charcoal/70 hover:text-charcoal-900 hover:bg-gold/20 dark:text-champagne/70 dark:hover:text-white dark:hover:bg-white/10 transition-colors"
            title="Dismiss notice"
            aria-label="Dismiss banner"
          >
            <X class="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  </Transition>
</template>
