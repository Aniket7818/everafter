import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Vendor, Venue, ShortlistItem, VendorInquiry } from '@/types'
import { defaultVendors, defaultVenues, defaultShortlist, defaultInquiries } from '@/data/mockData'
import { getStoredItem, setStoredItem } from '@/utils/storage'

export const useVendorStore = defineStore('vendors', () => {
  const vendors = ref<Vendor[]>(getStoredItem('vendors_catalog', defaultVendors))
  const venues = ref<Venue[]>(getStoredItem('venues_catalog', defaultVenues))
  const shortlist = ref<ShortlistItem[]>(getStoredItem('vendor_shortlist', defaultShortlist))
  const inquiries = ref<VendorInquiry[]>(getStoredItem('vendor_inquiries', defaultInquiries))

  function persist() {
    setStoredItem('vendors_catalog', vendors.value)
    setStoredItem('venues_catalog', venues.value)
    setStoredItem('vendor_shortlist', shortlist.value)
    setStoredItem('vendor_inquiries', inquiries.value)
  }

  // Getters
  const shortlistedVendors = computed(() => {
    return shortlist.value
      .filter(s => s.itemType === 'vendor')
      .map(s => {
        const vendor = vendors.value.find(v => v.id === s.itemId)
        return { ...s, vendor }
      })
      .filter(s => !!s.vendor)
  })

  const shortlistedVenues = computed(() => {
    return shortlist.value
      .filter(s => s.itemType === 'venue')
      .map(s => {
        const venue = venues.value.find(v => v.id === s.itemId)
        return { ...s, venue }
      })
      .filter(s => !!s.venue)
  })

  const bookedCount = computed(() => {
    return shortlist.value.filter(s => s.isBooked).length
  })

  // Check if an item is shortlisted
  function isShortlisted(itemId: string, itemType: 'vendor' | 'venue'): boolean {
    return shortlist.value.some(s => s.itemId === itemId && s.itemType === itemType)
  }

  function getShortlistItem(itemId: string, itemType: 'vendor' | 'venue'): ShortlistItem | undefined {
    return shortlist.value.find(s => s.itemId === itemId && s.itemType === itemType)
  }

  // Actions
  function toggleShortlist(itemType: 'vendor' | 'venue', itemId: string) {
    const existing = shortlist.value.find(s => s.itemId === itemId && s.itemType === itemType)
    if (existing) {
      shortlist.value = shortlist.value.filter(s => s.id !== existing.id)
    } else {
      let defaultCost = 0
      if (itemType === 'vendor') {
        defaultCost = vendors.value.find(v => v.id === itemId)?.startingPrice || 0
      } else {
        defaultCost = venues.value.find(v => v.id === itemId)?.startingPrice || 0
      }

      shortlist.value.push({
        id: `sl-${Date.now()}`,
        itemType,
        itemId,
        isPreferred: false,
        estimatedCost: defaultCost,
        isBooked: false,
        addedAt: new Date().toISOString().slice(0, 10)
      })
    }
    persist()
  }

  function updateShortlistItem(id: string, updates: Partial<ShortlistItem>) {
    const idx = shortlist.value.findIndex(s => s.id === id)
    if (idx !== -1) {
      shortlist.value[idx] = { ...shortlist.value[idx], ...updates }
      persist()
    }
  }

  function removeFromShortlist(id: string) {
    shortlist.value = shortlist.value.filter(s => s.id !== id)
    persist()
  }

  function sendInquiry(inquiryData: Omit<VendorInquiry, 'id' | 'createdAt' | 'status'>) {
    const newInquiry: VendorInquiry = {
      ...inquiryData,
      id: `inq-${Date.now()}`,
      status: 'Inquired',
      createdAt: new Date().toISOString().slice(0, 10)
    }
    inquiries.value.unshift(newInquiry)
    persist()
    return newInquiry
  }

  function markAsBooked(itemId: string, itemType: 'vendor' | 'venue') {
    const item = shortlist.value.find(s => s.itemId === itemId && s.itemType === itemType)
    if (item) {
      item.isBooked = !item.isBooked
      persist()
    }
  }

  return {
    vendors,
    venues,
    shortlist,
    inquiries,
    shortlistedVendors,
    shortlistedVenues,
    bookedCount,
    isShortlisted,
    getShortlistItem,
    toggleShortlist,
    updateShortlistItem,
    removeFromShortlist,
    sendInquiry,
    markAsBooked
  }
})
