import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Invitation } from '@/types'
import { defaultInvitation } from '@/data/mockData'
import { getStoredItem, setStoredItem } from '@/utils/storage'

export const useInvitationStore = defineStore('invitations', () => {
  const invitation = ref<Invitation>(getStoredItem('digital_invitation', defaultInvitation))

  function persist() {
    setStoredItem('digital_invitation', invitation.value)
  }

  function updateInvitation(updates: Partial<Invitation>) {
    invitation.value = { ...invitation.value, ...updates }
    persist()
  }

  function resetInvitation() {
    invitation.value = JSON.parse(JSON.stringify(defaultInvitation))
    persist()
  }

  return {
    invitation,
    updateInvitation,
    resetInvitation
  }
})
