<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  Bell,
  CheckCheck,
  Trash2,
  Filter,
  CheckCircle,
  Clock,
  Coins,
  Users,
  Calendar,
  ShoppingBag
} from 'lucide-vue-next'
import { useNotificationStore } from '@/stores/notifications'

const router = useRouter()
const notifStore = useNotificationStore()
const selectedCategory = ref<string>('')

const categories = [
  { id: '', name: 'All' },
  { id: 'payment', name: 'Payments Due' },
  { id: 'rsvp', name: 'RSVP Updates' },
  { id: 'task', name: 'Task Deadlines' },
  { id: 'vendor', name: 'Vendor Updates' }
]

const filteredNotifications = computed(() => {
  return notifStore.notifications.filter(n => {
    if (!selectedCategory.value) return true
    return n.category === selectedCategory.value
  })
})

function handleNotifClick(notif: any) {
  notifStore.markAsRead(notif.id)
  if (notif.actionUrl) {
    router.push(notif.actionUrl)
  }
}
</script>

<template>
  <div class="space-y-8 max-w-4xl mx-auto">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-serif font-bold text-charcoal dark:text-ivory">Notification Center</h1>
        <p class="text-xs text-warmgray">Important reminders, incoming RSVPs, and financial milestone alerts</p>
      </div>

      <div class="flex items-center gap-3">
        <button 
          type="button" 
          @click="notifStore.markAllAsRead"
          class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white dark:bg-charcoal border border-champagne/60 text-xs font-semibold text-charcoal dark:text-ivory hover:border-gold transition-colors"
        >
          <CheckCheck class="w-3.5 h-3.5 text-gold" />
          <span>Mark All as Read</span>
        </button>

        <button 
          type="button" 
          @click="notifStore.clearNotifications"
          class="p-2 rounded-xl border border-champagne/60 text-warmgray hover:text-rose-dark transition-colors"
          title="Clear all notifications"
        >
          <Trash2 class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- Category Filter Bar -->
    <div class="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
      <button 
        v-for="cat in categories"
        :key="cat.id"
        type="button" 
        @click="selectedCategory = cat.id"
        class="px-4 py-1.5 rounded-xl font-semibold transition-all whitespace-nowrap"
        :class="selectedCategory === cat.id 
          ? 'bg-gold text-white shadow-xs' 
          : 'bg-white dark:bg-charcoal border border-champagne/40 text-warmgray hover:text-charcoal'"
      >
        {{ cat.name }}
      </button>
    </div>

    <!-- Notification Items List -->
    <div class="p-6 rounded-3xl bg-white dark:bg-charcoal border border-champagne/40 dark:border-charcoal-light shadow-soft divide-y divide-champagne/20 dark:divide-charcoal-light/20">
      <div 
        v-for="notif in filteredNotifications" 
        :key="notif.id"
        @click="handleNotifClick(notif)"
        class="py-4 px-2 hover:bg-ivory/50 dark:hover:bg-charcoal-900 rounded-2xl cursor-pointer transition-colors flex items-start justify-between gap-4 group"
      >
        <div class="flex items-start gap-3.5">
          <div 
            class="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 mt-0.5"
            :class="{
              'bg-gold/20 text-gold-dark': notif.category === 'payment',
              'bg-emerald-100 text-emerald-700': notif.category === 'rsvp',
              'bg-champagne/30 text-charcoal': notif.category === 'task',
              'bg-rose/20 text-rose-dark': notif.category === 'vendor'
            }"
          >
            <Coins v-if="notif.category === 'payment'" class="w-5 h-5" />
            <Users v-else-if="notif.category === 'rsvp'" class="w-5 h-5" />
            <Clock v-else-if="notif.category === 'task'" class="w-5 h-5" />
            <ShoppingBag v-else class="w-5 h-5" />
          </div>

          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <span class="font-serif font-bold text-base text-charcoal dark:text-ivory" :class="{ 'text-gold font-bold': !notif.read }">
                {{ notif.title }}
              </span>
              <span v-if="!notif.read" class="w-2 h-2 rounded-full bg-gold shrink-0"></span>
            </div>
            <p class="text-xs text-warmgray leading-relaxed">{{ notif.message }}</p>
          </div>
        </div>

        <div class="flex flex-col items-end gap-2 shrink-0">
          <span class="text-[10px] text-warmgray">{{ notif.createdAt }}</span>
          <span v-if="notif.actionUrl" class="text-[11px] text-gold font-semibold group-hover:underline">
            View &rarr;
          </span>
        </div>
      </div>

      <div v-if="filteredNotifications.length === 0" class="py-12 text-center text-warmgray text-xs">
        No notifications in this view.
      </div>
    </div>
  </div>
</template>
