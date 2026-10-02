import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Table } from '@/types'
import { defaultTables } from '@/data/mockData'
import { getStoredItem, setStoredItem } from '@/utils/storage'
import { useGuestStore } from './guests'

export const useSeatingStore = defineStore('seating', () => {
  const guestStore = useGuestStore()
  const tables = ref<Table[]>(getStoredItem('seating_tables', defaultTables))

  function persist() {
    setStoredItem('seating_tables', tables.value)
  }

  // Getters
  const totalTableCapacity = computed(() => {
    return tables.value.reduce((acc, t) => acc + (t.capacity || 0), 0)
  })

  const assignedGuests = computed(() => {
    return guestStore.guests.filter(g => !!g.tableId)
  })

  const totalAssignedSeats = computed(() => {
    return assignedGuests.value.reduce((acc, g) => acc + 1 + (g.accompanyingGuests || 0), 0)
  })

  const totalRemainingSeats = computed(() => {
    return Math.max(0, totalTableCapacity.value - totalAssignedSeats.value)
  })

  const unassignedGuests = computed(() => {
    // Only accepted guests who are not assigned to a table
    return guestStore.guests.filter(g => !g.tableId && g.rsvpStatus !== 'Declined')
  })

  const tableStats = computed(() => {
    return tables.value.map(tbl => {
      const guestsAtTable = guestStore.guests.filter(g => g.tableId === tbl.id)
      const occupied = guestsAtTable.reduce((acc, g) => acc + 1 + (g.accompanyingGuests || 0), 0)
      const isFull = occupied >= tbl.capacity
      const isOver = occupied > tbl.capacity
      return {
        ...tbl,
        guests: guestsAtTable,
        occupied,
        remaining: Math.max(0, tbl.capacity - occupied),
        isFull,
        isOver
      }
    })
  })

  // Actions
  function addTable(tableData: Omit<Table, 'id'>) {
    const newTable: Table = {
      ...tableData,
      id: `tbl-${Date.now()}`
    }
    tables.value.push(newTable)
    persist()
    return newTable
  }

  function updateTable(id: string, updates: Partial<Table>) {
    const idx = tables.value.findIndex(t => t.id === id)
    if (idx !== -1) {
      tables.value[idx] = { ...tables.value[idx], ...updates }
      persist()
    }
  }

  function deleteTable(id: string) {
    // Unassign guests at this table first
    guestStore.guests.forEach(g => {
      if (g.tableId === id) {
        guestStore.updateGuest(g.id, { tableId: undefined, seatNumber: undefined })
      }
    })
    tables.value = tables.value.filter(t => t.id !== id)
    persist()
  }

  function assignGuestToTable(guestId: string, tableId: string) {
    const guest = guestStore.guests.find(g => g.id === guestId)
    const table = tables.value.find(t => t.id === tableId)
    if (guest && table) {
      guestStore.updateGuest(guestId, { tableId })
    }
  }

  function removeGuestFromTable(guestId: string) {
    guestStore.updateGuest(guestId, { tableId: undefined, seatNumber: undefined })
  }

  return {
    tables,
    totalTableCapacity,
    assignedGuests,
    totalAssignedSeats,
    totalRemainingSeats,
    unassignedGuests,
    tableStats,
    addTable,
    updateTable,
    deleteTable,
    assignGuestToTable,
    removeGuestFromTable
  }
})
