import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { CollaborationActivity } from '@/types'
import { defaultCollaborationActivity } from '@/data/mockData'
import { getStoredItem, setStoredItem } from '@/utils/storage'

export const useCollaborationStore = defineStore('collaboration', () => {
  const activities = ref<CollaborationActivity[]>(getStoredItem('collab_activities', defaultCollaborationActivity))

  function persist() {
    setStoredItem('collab_activities', activities.value)
  }

  function logActivity(action: string, target: string, authorName = 'You', authorRole: CollaborationActivity['authorRole'] = 'Partner') {
    const newAct: CollaborationActivity = {
      id: `act-${Date.now()}`,
      authorName,
      authorRole,
      action,
      target,
      timestamp: 'Just now'
    }
    activities.value.unshift(newAct)
    persist()
    return newAct
  }

  return {
    activities,
    logActivity
  }
})
