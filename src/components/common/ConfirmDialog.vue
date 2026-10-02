<script setup lang="ts">
import Modal from './Modal.vue'
import { AlertTriangle } from 'lucide-vue-next'

defineProps<{
  isOpen: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  isDestructive?: boolean
}>()

const emit = defineEmits<{
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()
</script>

<template>
  <Modal :is-open="isOpen" size="sm" @close="emit('cancel')">
    <div class="flex items-start gap-4">
      <div 
        class="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
        :class="isDestructive ? 'bg-rose/20 text-rose-dark dark:text-rose-light' : 'bg-gold/20 text-gold-dark dark:text-gold-light'"
      >
        <AlertTriangle class="w-5 h-5" />
      </div>
      <div class="space-y-1.5">
        <h4 class="font-serif text-lg font-semibold text-charcoal dark:text-ivory">
          {{ title }}
        </h4>
        <p class="text-sm text-warmgray dark:text-warmgray-light leading-relaxed">
          {{ message }}
        </p>
      </div>
    </div>

    <template #footer>
      <button 
        type="button" 
        @click="emit('cancel')"
        class="px-4 py-2 rounded-xl text-sm font-medium text-warmgray hover:text-charcoal dark:text-warmgray-light dark:hover:text-white transition-colors"
      >
        {{ cancelText || 'Cancel' }}
      </button>
      <button 
        type="button" 
        @click="emit('confirm')"
        class="px-4 py-2 rounded-xl text-sm font-medium text-white transition-all shadow-sm"
        :class="isDestructive ? 'bg-rose-dark hover:bg-rose-dark/90' : 'bg-gold hover:bg-gold-dark'"
      >
        {{ confirmText || 'Confirm' }}
      </button>
    </template>
  </Modal>
</template>
