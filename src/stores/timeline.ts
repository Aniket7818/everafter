import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { WeddingEvent } from '@/types'
import { defaultEvents } from '@/data/mockData'
import { getStoredItem, setStoredItem } from '@/utils/storage'
import { checkTimeOverlap } from '@/utils/date'
import { exportToCSV } from '@/utils/csv'

export const useTimelineStore = defineStore('timeline', () => {
  const events = ref<WeddingEvent[]>(getStoredItem('timeline_events', defaultEvents))

  function persist() {
    setStoredItem('timeline_events', events.value)
  }

  // Getters
  const sortedEvents = computed(() => {
    return [...events.value].sort((a, b) => {
      // Primary: by date
      if (a.date !== b.date) {
        return a.date.localeCompare(b.date)
      }
      // Secondary: by startTime
      return a.startTime.localeCompare(b.startTime)
    })
  })

  // Detect overlapping events on same date
  const overlappingPairs = computed(() => {
    const overlaps: { eventA: WeddingEvent; eventB: WeddingEvent }[] = []
    const evts = events.value
    for (let i = 0; i < evts.length; i++) {
      for (let j = i + 1; j < evts.length; j++) {
        const a = evts[i]
        const b = evts[j]
        if (a.date === b.date) {
          if (checkTimeOverlap(a.startTime, a.endTime, b.startTime, b.endTime)) {
            overlaps.push({ eventA: a, eventB: b })
          }
        }
      }
    }
    return overlaps
  })

  // Actions
  function addEvent(eventData: Omit<WeddingEvent, 'id' | 'order'>) {
    const newEvent: WeddingEvent = {
      ...eventData,
      id: `evt-${Date.now()}`,
      order: events.value.length + 1
    }
    events.value.push(newEvent)
    persist()
    return newEvent
  }

  function updateEvent(id: string, updates: Partial<WeddingEvent>) {
    const idx = events.value.findIndex(e => e.id === id)
    if (idx !== -1) {
      events.value[idx] = { ...events.value[idx], ...updates }
      persist()
    }
  }

  function deleteEvent(id: string) {
    events.value = events.value.filter(e => e.id !== id)
    // Reorder
    events.value.forEach((e, i) => (e.order = i + 1))
    persist()
  }

  function reorderEvents(newOrderedEvents: WeddingEvent[]) {
    events.value = newOrderedEvents.map((evt, idx) => ({
      ...evt,
      order: idx + 1
    }))
    persist()
  }

  function exportTimelineCSV() {
    const headers = ['Order', 'Event Name', 'Date', 'Start Time', 'End Time', 'Venue', 'Dress Code', 'Description', 'Notes']
    const rows = sortedEvents.value.map(e => [
      e.order,
      e.name,
      e.date,
      e.startTime,
      e.endTime,
      e.venue,
      e.dressCode || '',
      e.description,
      e.notes || ''
    ])
    exportToCSV(`everafter-timeline-${new Date().toISOString().slice(0, 10)}`, [headers, ...rows])
  }

  return {
    events,
    sortedEvents,
    overlappingPairs,
    addEvent,
    updateEvent,
    deleteEvent,
    reorderEvents,
    exportTimelineCSV
  }
})
