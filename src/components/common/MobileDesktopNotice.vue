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
      class="sticky top-0 z-50 w-full bg-linear-to-r from-charcoal-950 via-charcoal to-charcoal-950 text-ivory border-b border-gold/50 shadow-xl px-3.5 py-2.5 transition-all select-none"
      role="banner"
      aria-label="Desktop recommendation notice"
    >
      <div class="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <!-- Icon & Message -->
        <div class="flex items-center gap-3 min-w-0 flex-1">
          <div class="w-8 h-8 rounded-xl bg-gold/20 border border-gold/40 flex items-center justify-center text-gold shrink-0 shadow-sm">
            <Monitor class="w-4 h-4 animate-pulse" />
          </div>

          <div class="min-w-0 flex-1">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="font-serif font-bold text-xs sm:text-sm text-white tracking-wide">
                Best Experienced on Desktop
              </span>
              <span class="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-gold/25 text-champagne border border-gold/40">
                Recommended
              </span>
            </div>
            <p class="text-[11px] text-champagne/85 leading-tight truncate sm:whitespace-normal mt-0.5">
              For full features like the Seating Studio, Calendar &amp; Budget, please open on a laptop or desktop.
            </p>
          </div>
        </div>

        <!-- Action / Dismiss Button -->
        <div class="flex items-center gap-2 shrink-0">
          <button 
            type="button" 
            @click="dismiss"
            class="px-2.5 py-1 rounded-lg text-[11px] font-semibold text-champagne/90 hover:text-white bg-white/10 hover:bg-white/15 border border-white/10 transition-colors hidden sm:inline-block"
          >
            Continue
          </button>
          <button 
            type="button" 
            @click="dismiss"
            class="p-1.5 rounded-lg text-champagne/70 hover:text-white hover:bg-white/10 transition-colors"
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
