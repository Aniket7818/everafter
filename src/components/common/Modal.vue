<script setup lang="ts">
import { watch, onMounted, onUnmounted } from 'vue'
import { X } from 'lucide-vue-next'

const props = withDefaults(defineProps<{
  isOpen: boolean
  title?: string
  subtitle?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
}>(), {
  isOpen: false,
  size: 'md'
})

const emit = defineEmits<{
  (e: 'close'): void
}>()

function handleKeyDown(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.isOpen) {
    emit('close')
  }
}

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
  document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div 
        v-if="isOpen" 
        class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-charcoal/60 backdrop-blur-sm"
        @click.self="emit('close')"
      >
        <Transition
          enter-active-class="transition duration-250 cubic-bezier(0.16, 1, 0.3, 1)"
          enter-from-class="opacity-0 scale-95 translate-y-2"
          enter-to-class="opacity-100 scale-100 translate-y-0"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="opacity-100 scale-100 translate-y-0"
          leave-to-class="opacity-0 scale-95 translate-y-2"
        >
          <div 
            v-if="isOpen"
            class="relative w-full rounded-2xl bg-white dark:bg-charcoal text-charcoal dark:text-ivory shadow-2xl border border-champagne/40 dark:border-charcoal-light/60 overflow-hidden my-8"
            :class="{
              'max-w-md': size === 'sm',
              'max-w-lg': size === 'md',
              'max-w-2xl': size === 'lg',
              'max-w-4xl': size === 'xl',
              'max-w-5xl': size === '2xl'
            }"
            role="dialog"
            aria-modal="true"
          >
            <!-- Header -->
            <div v-if="title || $slots.header" class="flex items-start justify-between p-5 sm:p-6 border-b border-champagne/30 dark:border-charcoal-light/40">
              <slot name="header">
                <div>
                  <h3 class="text-xl font-serif font-semibold text-charcoal dark:text-ivory">{{ title }}</h3>
                  <p v-if="subtitle" class="text-xs text-warmgray dark:text-warmgray-light mt-0.5">{{ subtitle }}</p>
                </div>
              </slot>
              <button 
                type="button" 
                @click="emit('close')" 
                class="rounded-full p-1.5 text-warmgray hover:text-charcoal dark:text-warmgray-light dark:hover:text-white hover:bg-champagne/20 dark:hover:bg-charcoal-light/50 transition-colors"
                aria-label="Close dialog"
              >
                <X class="w-5 h-5" />
              </button>
            </div>

            <!-- Body -->
            <div class="p-5 sm:p-6 max-h-[75vh] overflow-y-auto">
              <slot></slot>
            </div>

            <!-- Footer -->
            <div v-if="$slots.footer" class="flex items-center justify-end gap-3 p-4 sm:p-6 bg-ivory/50 dark:bg-charcoal-900/40 border-t border-champagne/30 dark:border-charcoal-light/40">
              <slot name="footer"></slot>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>
