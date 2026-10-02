import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Notification } from '@/types'
import { defaultNotifications } from '@/data/mockData'
import { getStoredItem, setStoredItem } from '@/utils/storage'

export const useNotificationStore = defineStore('notifications', () => {
  const notifications = ref<Notification[]>(getStoredItem('notifications_list', defaultNotifications))

  function persist() {
    setStoredItem('notifications_list', notifications.value)
  }

  const unreadCount = computed(() => notifications.value.filter(n => !n.read).length)

  function addNotification(notifData: Omit<Notification, 'id' | 'read' | 'createdAt'>) {
    const newNotif: Notification = {
      ...notifData,
      id: `notif-${Date.now()}`,
      read: false,
      createdAt: 'Just now'
    }
    notifications.value.unshift(newNotif)
    persist()
    return newNotif
  }

  function markAsRead(id: string) {
    const notif = notifications.value.find(n => n.id === id)
    if (notif) {
      notif.read = true
      persist()
    }
  }

  function markAllAsRead() {
    notifications.value.forEach(n => (n.read = true))
    persist()
  }

  function clearNotifications() {
    notifications.value = []
    persist()
  }

  return {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearNotifications
  }
})
