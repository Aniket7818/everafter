import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { CalendarEvent } from '@/types'
import { getStoredItem, setStoredItem } from '@/utils/storage'
import { useTimelineStore } from './timeline'
import { useChecklistStore } from './checklist'

export const defaultCalendarEvents: CalendarEvent[] = [
  { id: 'cal-1', title: 'Phoolon Ki Holi & Haldi', start: '2026-11-26T10:30:00', end: '2026-11-26T14:00:00', category: 'function', color: '#B99A62', location: 'The Oberoi Udaivilas' },
  { id: 'cal-2', title: 'Sunset Mehendi & Bazaar', start: '2026-11-26T16:30:00', end: '2026-11-26T21:00:00', category: 'function', color: '#AAB5A0', location: 'Lakeside Promontory' },
  { id: 'cal-3', title: 'The Royal Sangeet Night', start: '2026-11-27T19:00:00', end: '2026-11-28T01:30:00', category: 'function', color: '#BD968D', location: 'Chhatri Ballroom' },
  { id: 'cal-4', title: 'Vedic Wedding Ceremony (Pheras)', start: '2026-11-28T16:00:00', end: '2026-11-28T20:30:00', category: 'function', color: '#937740', location: 'Glass Mandap' },
  { id: 'cal-5', title: 'Grand Imperial Reception', start: '2026-11-29T19:30:00', end: '2026-11-30T02:00:00', category: 'function', color: '#292725', location: 'Palace Pavilion' },
  { id: 'cal-6', title: 'Chef Tasting Session & Menu Finalization', start: '2026-10-18T14:00:00', end: '2026-10-18T16:30:00', category: 'vendor_meeting', color: '#D8C29D', location: 'The Oberoi Kitchen' },
  { id: 'cal-7', title: 'Final Bridal Lehenga Fitting', start: '2026-10-25T11:00:00', end: '2026-10-25T13:00:00', category: 'personal', color: '#EAD7D2', location: 'Delhi Atelier' },
  { id: 'cal-8', title: 'Oberoi Udaivilas Balance Payment Due', start: '2026-10-15', allDay: true, category: 'payment_due', color: '#D9B8B0', description: 'Wire transfer second milestone installment' }
]

export const useCalendarStore = defineStore('calendar', () => {
  const customEvents = ref<CalendarEvent[]>(getStoredItem('calendar_events', defaultCalendarEvents))

  function persist() {
    setStoredItem('calendar_events', customEvents.value)
  }

  function addEvent(eventData: Omit<CalendarEvent, 'id'>) {
    const newEvt: CalendarEvent = {
      ...eventData,
      id: `cal-${Date.now()}`
    }
    customEvents.value.push(newEvt)
    persist()
    return newEvt
  }

  function updateEvent(id: string, updates: Partial<CalendarEvent>) {
    const idx = customEvents.value.findIndex(e => e.id === id)
    if (idx !== -1) {
      customEvents.value[idx] = { ...customEvents.value[idx], ...updates }
      persist()
    }
  }

  function deleteEvent(id: string) {
    customEvents.value = customEvents.value.filter(e => e.id !== id)
    persist()
  }

  return {
    customEvents,
    addEvent,
    updateEvent,
    deleteEvent
  }
})
