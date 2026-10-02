<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { Monitor, Laptop, X, ArrowRight, Sparkles, Smartphone } from 'lucide-vue-next'

const isMobile = ref(false)
const isDismissed = ref(false)

function checkViewport() {
  const mobile = window.innerWidth < 1024
  isMobile.value = mobile

  // If user switches to desktop, reset dismissed flag so if they switch back to mobile,
  // it reminds them again as requested:
  // "when switch desktop that notification or pop up will disappear, when ever user open mobile mode tell everytime to use desktop"
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
  <!-- Only renders when in mobile mode and not dismissed. Auto-disappears on desktop! -->
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="opacity-0 translate-y-4 scale-95"
    enter-to-class="opacity-100 translate-y-0 scale-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="opacity-100 translate-y-0 scale-100"
    leave-to-class="opacity-0 translate-y-4 scale-95"
  >
    <div 
      v-if="isMobile && !isDismissed" 
      class="fixed bottom-4 left-4 right-4 z-50 sm:max-w-md sm:mx-auto select-none"
      role="alert"
      aria-live="polite"
    >
      <div class="relative overflow-hidden rounded-3xl bg-charcoal text-ivory p-5 shadow-2xl border-2 border-gold/60 backdrop-blur-md">
        <!-- Ambient gold backlight glow -->
        <div class="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-gold/20 blur-2xl pointer-events-none"></div>

        <div class="relative z-10 flex items-start gap-4">
          <!-- Icon with pulse -->
          <div class="w-12 h-12 rounded-2xl bg-charcoal-light border border-gold/40 flex items-center justify-center text-gold shrink-0 mt-0.5 shadow-soft">
            <Monitor class="w-6 h-6 animate-pulse" />
          </div>

          <!-- Message -->
          <div class="space-y-1.5 flex-1 min-w-0">
            <div class="flex items-center gap-2">
              <span class="text-[10px] font-bold uppercase tracking-widest text-champagne bg-charcoal-light px-2 py-0.5 rounded-full border border-champagne/30">
                Desktop Recommended
              </span>
            </div>

            <h3 class="font-serif text-lg font-bold text-white leading-tight">
              Best Experienced on Desktop
            </h3>

            <p class="text-xs text-champagne/90 leading-relaxed">
              For a better planning experience, please open <strong class="text-white">EverAfter</strong> on your laptop or desktop. The Interactive Seating Studio, Multi-Day Timeline, Master Calendar, and Budget Analytics are optimized for larger screens.
            </p>

            <!-- Action buttons -->
            <div class="flex items-center gap-2 pt-2.5">
              <button 
                type="button" 
                @click="dismiss"
                class="px-4 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-colors"
              >
                Continue on Mobile
              </button>

              <button 
                type="button" 
                @click="dismiss"
                class="px-4 py-2 rounded-xl text-xs font-semibold bg-gold hover:bg-gold-dark text-white transition-all shadow-sm flex items-center gap-1.5"
              >
                <span>Understood</span>
                <ArrowRight class="w-3 h-3" />
              </button>
            </div>
          </div>

          <!-- Close 'X' Button -->
          <button 
            type="button" 
            @click="dismiss"
            class="p-1 rounded-full text-warmgray hover:text-white transition-colors shrink-0"
            aria-label="Close notification"
          >
            <X class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>
