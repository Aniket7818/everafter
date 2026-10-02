import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { MoodboardCollection, MoodboardItem } from '@/types'
import { defaultMoodboardCollections, defaultMoodboardItems } from '@/data/mockData'
import { getStoredItem, setStoredItem } from '@/utils/storage'

export const useMoodboardStore = defineStore('moodboard', () => {
  const collections = ref<MoodboardCollection[]>(getStoredItem('moodboard_collections', defaultMoodboardCollections))
  const items = ref<MoodboardItem[]>(getStoredItem('moodboard_items', defaultMoodboardItems))

  function persist() {
    setStoredItem('moodboard_collections', collections.value)
    setStoredItem('moodboard_items', items.value)
  }

  function addCollection(title: string, description?: string, coverImage?: string) {
    const newCol: MoodboardCollection = {
      id: `col-${Date.now()}`,
      title,
      description,
      coverImage: coverImage || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80'
    }
    collections.value.push(newCol)
    persist()
    return newCol
  }

  function updateCollection(id: string, updates: Partial<MoodboardCollection>) {
    const idx = collections.value.findIndex(c => c.id === id)
    if (idx !== -1) {
      collections.value[idx] = { ...collections.value[idx], ...updates }
      persist()
    }
  }

  function deleteCollection(id: string) {
    collections.value = collections.value.filter(c => c.id !== id)
    items.value = items.value.filter(i => i.collectionId !== id)
    persist()
  }

  function addItem(itemData: Omit<MoodboardItem, 'id' | 'order'>) {
    const colItems = items.value.filter(i => i.collectionId === itemData.collectionId)
    const newItem: MoodboardItem = {
      ...itemData,
      id: `m-${Date.now()}`,
      order: colItems.length + 1
    }
    items.value.unshift(newItem)
    persist()
    return newItem
  }

  function updateItem(id: string, updates: Partial<MoodboardItem>) {
    const idx = items.value.findIndex(i => i.id === id)
    if (idx !== -1) {
      items.value[idx] = { ...items.value[idx], ...updates }
      persist()
    }
  }

  function deleteItem(id: string) {
    items.value = items.value.filter(i => i.id !== id)
    persist()
  }

  return {
    collections,
    items,
    addCollection,
    updateCollection,
    deleteCollection,
    addItem,
    updateItem,
    deleteItem
  }
})
