import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Guest, RSVPStatus, MealPreference } from '@/types'
import { defaultGuests } from '@/data/mockData'
import { getStoredItem, setStoredItem } from '@/utils/storage'
import { exportToCSV } from '@/utils/csv'

export const useGuestStore = defineStore('guests', () => {
  const guests = ref<Guest[]>(getStoredItem('guests_list', defaultGuests))

  function persist() {
    setStoredItem('guests_list', guests.value)
  }

  // Getters
  const totalEntries = computed(() => guests.value.length)

  const totalHeadcount = computed(() => {
    return guests.value.reduce((acc, g) => acc + 1 + (g.accompanyingGuests || 0), 0)
  })

  const acceptedCount = computed(() => {
    return guests.value
      .filter(g => g.rsvpStatus === 'Accepted')
      .reduce((acc, g) => acc + 1 + (g.accompanyingGuests || 0), 0)
  })

  const pendingCount = computed(() => {
    return guests.value
      .filter(g => g.rsvpStatus === 'Pending')
      .reduce((acc, g) => acc + 1 + (g.accompanyingGuests || 0), 0)
  })

  const declinedCount = computed(() => {
    return guests.value
      .filter(g => g.rsvpStatus === 'Declined')
      .reduce((acc, g) => acc + 1 + (g.accompanyingGuests || 0), 0)
  })

  const responseRate = computed(() => {
    if (!totalHeadcount.value) return 0
    const answered = totalHeadcount.value - pendingCount.value
    return Math.round((answered / totalHeadcount.value) * 100)
  })

  const sideBreakdown = computed(() => {
    const counts = { 'Partner A': 0, 'Partner B': 0, 'Both': 0, 'Other': 0 }
    guests.value.forEach(g => {
      const count = 1 + (g.accompanyingGuests || 0)
      if (counts[g.side] !== undefined) {
        counts[g.side] += count
      } else {
        counts['Other'] += count
      }
    })
    return counts
  })

  const mealSummary = computed(() => {
    const summary: Record<string, number> = {}
    guests.value.forEach(g => {
      const pref = g.mealPreference || 'Unspecified'
      const count = 1 + (g.accompanyingGuests || 0)
      summary[pref] = (summary[pref] || 0) + count
    })
    return summary
  })

  // Actions
  function addGuest(guestData: Omit<Guest, 'id' | 'code'>) {
    const randomCode = `EA-${Math.floor(1000 + Math.random() * 9000)}`
    const newGuest: Guest = {
      ...guestData,
      id: `g-${Date.now()}`,
      code: randomCode
    }
    guests.value.unshift(newGuest)
    persist()
    return newGuest
  }

  function updateGuest(id: string, updates: Partial<Guest>) {
    const idx = guests.value.findIndex(g => g.id === id)
    if (idx !== -1) {
      guests.value[idx] = { ...guests.value[idx], ...updates }
      persist()
    }
  }

  function deleteGuest(id: string) {
    guests.value = guests.value.filter(g => g.id !== id)
    persist()
  }

  function bulkAddGuests(rawNames: string[], defaultSide: Guest['side'] = 'Partner A', defaultGroup: string = 'Friends') {
    const added: Guest[] = []
    rawNames.forEach((name, index) => {
      const trimmed = name.trim()
      if (trimmed) {
        const randomCode = `EA-${Math.floor(1000 + Math.random() * 9000)}-${index + 1}`
        const guest: Guest = {
          id: `g-${Date.now()}-${index}`,
          code: randomCode,
          fullName: trimmed,
          side: defaultSide,
          group: defaultGroup,
          accompanyingGuests: 0,
          invitedEventIds: [],
          rsvpStatus: 'Pending',
          mealPreference: 'Vegetarian'
        }
        added.push(guest)
      }
    })
    guests.value.push(...added)
    persist()
    return added.length
  }

  function findGuestByCode(code: string): Guest | undefined {
    const cleanCode = code.trim().toUpperCase()
    return guests.value.find(g => g.code.toUpperCase() === cleanCode)
  }

  function submitRsvpResponse(code: string, status: RSVPStatus, accompanyingCount: number, mealPreference: MealPreference, message?: string) {
    const guest = findGuestByCode(code)
    if (!guest) return false

    guest.rsvpStatus = status
    guest.accompanyingGuests = accompanyingCount
    guest.mealPreference = mealPreference
    if (message) {
      guest.internalNotes = guest.internalNotes 
        ? `${guest.internalNotes} | RSVP Note: ${message}` 
        : `RSVP Note: ${message}`
    }
    persist()
    return true
  }

  function exportGuestsCSV() {
    const headers = ['Code', 'Full Name', 'Email', 'Phone', 'Side', 'Group', 'Accompanying Guests', 'Total Count', 'RSVP Status', 'Meal Preference', 'Dietary Notes', 'Internal Notes']
    const rows = guests.value.map(g => [
      g.code,
      g.fullName,
      g.email || '',
      g.phone || '',
      g.side,
      g.group,
      g.accompanyingGuests,
      1 + g.accompanyingGuests,
      g.rsvpStatus,
      g.mealPreference,
      g.dietaryRequirements || '',
      g.internalNotes || ''
    ])
    exportToCSV(`everafter-guests-${new Date().toISOString().slice(0, 10)}`, [headers, ...rows])
  }

  return {
    guests,
    totalEntries,
    totalHeadcount,
    acceptedCount,
    pendingCount,
    declinedCount,
    responseRate,
    sideBreakdown,
    mealSummary,
    addGuest,
    updateGuest,
    deleteGuest,
    bulkAddGuests,
    findGuestByCode,
    submitRsvpResponse,
    exportGuestsCSV
  }
})
