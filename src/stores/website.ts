import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { WeddingWebsiteConfig, WeddingWebsiteSection } from '@/types'
import { defaultWebsiteConfig } from '@/data/mockData'
import { getStoredItem, setStoredItem } from '@/utils/storage'

export const useWebsiteStore = defineStore('website', () => {
  const config = ref<WeddingWebsiteConfig>(getStoredItem('wedding_website_config', defaultWebsiteConfig))

  function persist() {
    setStoredItem('wedding_website_config', config.value)
  }

  function updateConfig(updates: Partial<WeddingWebsiteConfig>) {
    config.value = { ...config.value, ...updates }
    persist()
  }

  function toggleSection(sectionId: string) {
    const sec = config.value.sections.find(s => s.id === sectionId)
    if (sec) {
      sec.enabled = !sec.enabled
      persist()
    }
  }

  function reorderSections(newSections: WeddingWebsiteSection[]) {
    config.value.sections = newSections.map((s, idx) => ({ ...s, order: idx + 1 }))
    persist()
  }

  return {
    config,
    updateConfig,
    toggleSection,
    reorderSections
  }
})
